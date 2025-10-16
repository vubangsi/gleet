import { BaseAgent, AgentTask, AgentResult } from '../base/agent'
import { OpenAI } from 'openai'
import { prisma } from '@/infrastructure/database/prisma-client'

interface GitHubRepo {
  name: string
  fullName: string
  description: string
  language: string
  stars: number
  forks: number
  openIssues: number
  url: string
}

export class OpenSourceContributorAgent extends BaseAgent {
  private openai: OpenAI

  constructor() {
    super({
      name: 'Open Source Contributor',
      type: 'OpenSourceContributor',
      description: 'Finds and contributes to open source projects',
      schedule: '0 10 * * *', // Daily at 10 AM
      isActive: true,
    })

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    try {
      const { userId } = task
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          agentTasks: {
            where: { type: 'OpenSourceContribution' },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      })

      if (!user || !user.githubToken) {
        return { success: false, error: 'User not found or GitHub not connected' }
      }

      // Find suitable projects
      const projects = await this.findSuitableProjects(user.githubToken)
      
      if (projects.length === 0) {
        return { success: false, error: 'No suitable projects found' }
      }

      // Select best project for contribution
      const selectedProject = await this.selectProject(projects, user.id)
      
      // Analyze project and suggest contribution
      const contribution = await this.analyzeAndSuggestContribution(selectedProject)
      
      // Save project and contribution plan
      const savedProject = await this.saveProject(selectedProject)
      const savedContribution = await prisma.contribution.create({
        data: {
          userId,
          projectId: savedProject.id,
          type: contribution.type,
          title: contribution.title,
          description: contribution.description,
          status: 'Planned',
        },
      })

      return {
        success: true,
        output: {
          projectName: selectedProject.fullName,
          contributionType: contribution.type,
          contributionTitle: contribution.title,
          contributionId: savedContribution.id,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private async findSuitableProjects(githubToken: string): Promise<GitHubRepo[]> {
    // Search for projects with good first issues, active maintenance, etc.
    const searchQueries = [
      'label:"good first issue" language:typescript stars:100..1000',
      'label:"help wanted" language:javascript stars:50..500',
      'label:"beginner friendly" language:python stars:100..1000',
      'topic:hacktoberfest language:typescript',
    ]

    const projects: GitHubRepo[] = []
    
    for (const query of searchQueries) {
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&per_page=10`,
          {
            headers: {
              Authorization: `token ${githubToken}`,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          const repos = data.items.map((repo: any) => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || '',
            language: repo.language || 'Unknown',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            openIssues: repo.open_issues_count,
            url: repo.html_url,
          }))
          
          projects.push(...repos)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }

    return projects.slice(0, 20) // Limit to top 20 projects
  }

  private async selectProject(projects: GitHubRepo[], userId: string): Promise<GitHubRepo> {
    // Get user's previous contributions to avoid duplicates
    const previousContributions = await prisma.contribution.findMany({
      where: { userId },
      include: { project: true },
    })

    const contributedProjects = new Set(
      previousContributions.map(c => c.project.fullName)
    )

    // Filter out already contributed projects
    const availableProjects = projects.filter(
      p => !contributedProjects.has(p.fullName)
    )

    if (availableProjects.length === 0) {
      return projects[0] // Fallback to first project
    }

    // Score projects based on various factors
    const scoredProjects = availableProjects.map(project => ({
      project,
      score: this.scoreProject(project),
    }))

    // Sort by score and return the best one
    scoredProjects.sort((a, b) => b.score - a.score)
    return scoredProjects[0].project
  }

  private scoreProject(project: GitHubRepo): number {
    let score = 0
    
    // Prefer projects with moderate stars (not too small, not too big)
    if (project.stars >= 50 && project.stars <= 1000) score += 10
    if (project.stars >= 100 && project.stars <= 500) score += 5
    
    // Prefer projects with open issues (indicates active development)
    if (project.openIssues > 5 && project.openIssues < 100) score += 8
    
    // Prefer certain languages
    const preferredLanguages = ['typescript', 'javascript', 'python', 'go', 'rust']
    if (preferredLanguages.includes(project.language.toLowerCase())) score += 5
    
    // Prefer projects with good descriptions
    if (project.description && project.description.length > 20) score += 3
    
    return score
  }

  private async analyzeAndSuggestContribution(project: GitHubRepo) {
    const prompt = `
Analyze this open source project and suggest a meaningful contribution:

**Project:** ${project.fullName}
**Description:** ${project.description}
**Language:** ${project.language}
**Stars:** ${project.stars}
**Open Issues:** ${project.openIssues}

Suggest one of the following types of contributions:
1. Bug fix
2. Feature enhancement
3. Documentation improvement
4. Test coverage improvement
5. Performance optimization

Provide:
- Contribution type
- Specific title for the contribution
- Brief description of what to implement/fix
- Why this would be valuable to the project

Keep suggestions realistic and achievable for a developer looking to contribute.
`

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an experienced open source contributor who helps developers find meaningful ways to contribute to projects.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content || ''
    
    // Parse the response to extract structured data
    return {
      type: this.extractContributionType(content),
      title: this.extractTitle(content),
      description: content,
    }
  }

  private extractContributionType(content: string): string {
    const types = ['Bug fix', 'Feature enhancement', 'Documentation improvement', 'Test coverage improvement', 'Performance optimization']
    
    for (const type of types) {
      if (content.toLowerCase().includes(type.toLowerCase())) {
        return type
      }
    }
    
    return 'Documentation improvement' // Default fallback
  }

  private extractTitle(content: string): string {
    const lines = content.split('\n')
    const titleLine = lines.find(line => 
      line.includes('title') || 
      line.includes('Title') ||
      line.startsWith('**') ||
      line.startsWith('##')
    )
    
    if (titleLine) {
      return titleLine.replace(/[*#\-:]/g, '').trim()
    }
    
    return 'Contribute to project improvement'
  }

  private async saveProject(project: GitHubRepo) {
    return await prisma.openSourceProject.upsert({
      where: { fullName: project.fullName },
      update: {
        name: project.name,
        description: project.description,
        language: project.language,
        stars: project.stars,
        forks: project.forks,
        issues: project.openIssues,
        githubUrl: project.url,
        lastAnalyzed: new Date(),
      },
      create: {
        name: project.name,
        fullName: project.fullName,
        description: project.description,
        language: project.language,
        stars: project.stars,
        forks: project.forks,
        issues: project.openIssues,
        difficulty: this.determineDifficulty(project),
        tags: JSON.stringify([project.language]),
        githubUrl: project.url,
        lastAnalyzed: new Date(),
      },
    })
  }

  private determineDifficulty(project: GitHubRepo): string {
    if (project.stars < 100) return 'Beginner'
    if (project.stars < 500) return 'Intermediate'
    return 'Advanced'
  }
}
