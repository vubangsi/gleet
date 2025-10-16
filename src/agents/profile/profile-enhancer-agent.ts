import { BaseAgent, AgentTask, AgentResult } from '../base/agent'
import { OpenAI } from 'openai'
import { prisma } from '@/infrastructure/database/prisma-client'

interface ProfileEnhancementTask {
  type: 'README_OPTIMIZATION' | 'PORTFOLIO_GENERATION' | 'SKILL_ASSESSMENT' | 'NETWORKING_SUGGESTIONS' | 'LEARNING_PATH'
  priority: number
  description: string
  actionItems: string[]
}

export class ProfileEnhancerAgent extends BaseAgent {
  private openai: OpenAI

  constructor() {
    super({
      name: 'Profile Enhancer',
      type: 'ProfileEnhancer',
      description: 'Analyzes and suggests improvements for developer profiles and portfolios',
      schedule: '0 11 * * 1', // Weekly on Mondays at 11 AM
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
          leetcodeSolutions: {
            include: { problem: true },
            orderBy: { createdAt: 'desc' },
            take: 20,
          },
          agentTasks: {
            where: { 
              type: { in: ['LeetcodeSolution', 'OpenSourceContribution'] },
              status: 'Completed'
            },
            orderBy: { completedAt: 'desc' },
            take: 30,
          },
        },
      })

      if (!user) {
        return { success: false, error: 'User not found' }
      }

      // Analyze user's current profile and activities
      const profileAnalysis = await this.analyzeProfile(user)
      
      // Generate enhancement suggestions
      const enhancements = await this.generateEnhancements(profileAnalysis)
      
      // Create actionable tasks
      const actionableTasks = await this.createActionableTasks(enhancements, userId)

      return {
        success: true,
        output: {
          profileScore: profileAnalysis.score,
          strengths: profileAnalysis.strengths,
          improvements: profileAnalysis.improvements,
          enhancementTasks: actionableTasks,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private async analyzeProfile(user: any) {
    const leetcodeStats = this.analyzeLeetCodeProgress(user.leetcodeSolutions)
    const activityStats = this.analyzeActivityPattern(user.agentTasks)
    
    const prompt = `
Analyze this developer's profile and provide a comprehensive assessment:

**Developer Profile:**
- Name: ${user.name}
- Email: ${user.email}
- GitHub Connected: ${user.githubUsername ? 'Yes' : 'No'}
- Account Age: ${Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))} days

**LeetCode Progress:**
- Total Problems Solved: ${leetcodeStats.totalSolved}
- Easy: ${leetcodeStats.easy}, Medium: ${leetcodeStats.medium}, Hard: ${leetcodeStats.hard}
- Most Recent Activity: ${leetcodeStats.lastActivity}
- Consistency: ${leetcodeStats.consistency}

**Activity Pattern:**
- Total Completed Tasks: ${activityStats.totalTasks}
- Recent Activity: ${activityStats.recentActivity}
- Task Types: ${JSON.stringify(activityStats.taskTypes)}

Provide:
1. Overall profile score (1-100)
2. Top 3 strengths
3. Top 5 areas for improvement
4. Specific recommendations for profile enhancement

Focus on actionable insights that will help improve their developer profile and career prospects.
`

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a senior technical recruiter and career coach who helps developers optimize their profiles for career growth.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    })

    const analysis = response.choices[0]?.message?.content || ''
    
    return {
      score: this.extractScore(analysis),
      strengths: this.extractStrengths(analysis),
      improvements: this.extractImprovements(analysis),
      fullAnalysis: analysis,
    }
  }

  private analyzeLeetCodeProgress(solutions: any[]) {
    const difficulties = solutions.reduce((acc, sol) => {
      acc[sol.problem.difficulty.toLowerCase()] = (acc[sol.problem.difficulty.toLowerCase()] || 0) + 1
      return acc
    }, {})

    const lastActivity = solutions.length > 0 
      ? Math.floor((Date.now() - solutions[0].createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : null

    // Calculate consistency (problems solved in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentSolutions = solutions.filter(sol => sol.createdAt > thirtyDaysAgo)

    return {
      totalSolved: solutions.length,
      easy: difficulties.easy || 0,
      medium: difficulties.medium || 0,
      hard: difficulties.hard || 0,
      lastActivity: lastActivity ? `${lastActivity} days ago` : 'Never',
      consistency: `${recentSolutions.length} problems in last 30 days`,
    }
  }

  private analyzeActivityPattern(tasks: any[]) {
    const taskTypes = tasks.reduce((acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1
      return acc
    }, {})

    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentTasks = tasks.filter(task => task.completedAt && task.completedAt > lastWeek)

    return {
      totalTasks: tasks.length,
      recentActivity: `${recentTasks.length} tasks completed in last week`,
      taskTypes,
    }
  }

  private async generateEnhancements(analysis: any): Promise<ProfileEnhancementTask[]> {
    const enhancements: ProfileEnhancementTask[] = []

    // README optimization
    enhancements.push({
      type: 'README_OPTIMIZATION',
      priority: 8,
      description: 'Optimize GitHub profile README with stats, projects, and skills showcase',
      actionItems: [
        'Add GitHub stats widgets',
        'Showcase top projects with descriptions',
        'Include technology stack and skills',
        'Add contact information and social links',
      ],
    })

    // Portfolio generation
    enhancements.push({
      type: 'PORTFOLIO_GENERATION',
      priority: 9,
      description: 'Create a professional portfolio website showcasing projects and skills',
      actionItems: [
        'Design responsive portfolio layout',
        'Integrate GitHub projects automatically',
        'Add LeetCode progress visualization',
        'Include testimonials and achievements',
      ],
    })

    // Skill assessment
    enhancements.push({
      type: 'SKILL_ASSESSMENT',
      priority: 7,
      description: 'Assess current skills and identify learning gaps',
      actionItems: [
        'Analyze code quality and patterns',
        'Identify trending technologies to learn',
        'Suggest certification paths',
        'Recommend practice projects',
      ],
    })

    // Networking suggestions
    enhancements.push({
      type: 'NETWORKING_SUGGESTIONS',
      priority: 6,
      description: 'Provide networking opportunities and community engagement suggestions',
      actionItems: [
        'Identify relevant tech communities',
        'Suggest conferences and meetups',
        'Recommend open source projects to follow',
        'Find potential mentors in the field',
      ],
    })

    // Learning path
    enhancements.push({
      type: 'LEARNING_PATH',
      priority: 8,
      description: 'Create personalized learning roadmap based on career goals',
      actionItems: [
        'Define short-term and long-term goals',
        'Create structured learning schedule',
        'Identify key projects to build',
        'Set measurable milestones',
      ],
    })

    return enhancements.sort((a, b) => b.priority - a.priority)
  }

  private async createActionableTasks(enhancements: ProfileEnhancementTask[], userId: string) {
    const tasks = []

    for (const enhancement of enhancements.slice(0, 3)) { // Top 3 priorities
      const task = await prisma.agentTask.create({
        data: {
          agentId: 'profile-enhancer', // This would be the actual agent ID
          userId,
          type: enhancement.type,
          status: 'Pending',
          input: JSON.stringify({
            description: enhancement.description,
            actionItems: enhancement.actionItems,
            priority: enhancement.priority,
          }),
          scheduledAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in next week
        },
      })

      tasks.push({
        id: task.id,
        type: enhancement.type,
        description: enhancement.description,
        actionItems: enhancement.actionItems,
        priority: enhancement.priority,
      })
    }

    return tasks
  }

  private extractScore(analysis: string): number {
    const scoreMatch = analysis.match(/score[:\s]*(\d+)/i)
    return scoreMatch ? parseInt(scoreMatch[1]) : 75 // Default score
  }

  private extractStrengths(analysis: string): string[] {
    const strengthsSection = analysis.match(/strengths?[:\s]*\n?(.*?)(?=\n.*?improvement|$)/is)
    if (!strengthsSection) return ['Consistent problem solving', 'Active learning', 'Technical growth']
    
    return strengthsSection[1]
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim())
      .slice(0, 3)
  }

  private extractImprovements(analysis: string): string[] {
    const improvementsSection = analysis.match(/improvement[s]?[:\s]*\n?(.*?)(?=\n.*?recommendation|$)/is)
    if (!improvementsSection) return ['Increase problem diversity', 'Build portfolio projects', 'Engage with community']
    
    return improvementsSection[1]
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim())
      .slice(0, 5)
  }
}
