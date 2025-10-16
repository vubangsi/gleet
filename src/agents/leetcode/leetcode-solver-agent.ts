import { BaseAgent, AgentTask, AgentResult } from '../base/agent'
import { OpenAI } from 'openai'
import { prisma } from '@/infrastructure/database/prisma-client'

interface LeetCodeProblem {
  id: number
  title: string
  difficulty: string
  category: string
  description: string
  examples: any[]
}

export class LeetCodeSolverAgent extends BaseAgent {
  private openai: OpenAI

  constructor() {
    super({
      name: 'LeetCode Solver',
      type: 'LeetcodeSolver',
      description: 'Generates solutions for LeetCode problems with detailed explanations',
      schedule: '0 9 * * *', // Daily at 9 AM
      isActive: true,
    })

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    try {
      const { userId } = task
      
      // Get user's skill level and progress
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          leetcodeSolutions: {
            include: { problem: true },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      })

      if (!user) {
        return { success: false, error: 'User not found' }
      }

      // Select appropriate problem based on user's progress
      const problem = await this.selectProblem(user.leetcodeSolutions)
      
      if (!problem) {
        return { success: false, error: 'No suitable problem found' }
      }

      // Generate solution
      const solution = await this.generateSolution(problem)
      
      // Save solution to database
      const savedSolution = await prisma.leetcodeSolution.create({
        data: {
          userId,
          problemId: problem.id,
          solution: solution.markdown,
          language: solution.language,
          complexity: solution.complexity,
          explanation: solution.explanation,
        },
      })

      // Commit to GitHub if user has integration
      if (user.githubToken && user.githubUsername) {
        const githubPath = await this.commitToGitHub(
          user.githubToken,
          user.githubUsername,
          problem,
          solution
        )
        
        await prisma.leetcodeSolution.update({
          where: { id: savedSolution.id },
          data: { githubPath },
        })
      }

      return {
        success: true,
        output: {
          problemId: problem.id,
          problemTitle: problem.title,
          solutionId: savedSolution.id,
          githubPath: savedSolution.githubPath,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private async selectProblem(recentSolutions: any[]): Promise<LeetCodeProblem | null> {
    // Intelligent problem selection based on user's progress
    const solvedProblems = recentSolutions.map(s => s.problemId)
    const lastDifficulties = recentSolutions.slice(0, 5).map(s => s.problem.difficulty)
    
    // Determine next difficulty level
    let targetDifficulty = 'Easy'
    if (lastDifficulties.length >= 3) {
      const easyCount = lastDifficulties.filter(d => d === 'Easy').length
      const mediumCount = lastDifficulties.filter(d => d === 'Medium').length
      
      if (easyCount >= 3 && mediumCount === 0) {
        targetDifficulty = 'Medium'
      } else if (mediumCount >= 3) {
        targetDifficulty = 'Hard'
      }
    }

    // Find unsolved problem of target difficulty
    const problem = await prisma.leetcodeProblem.findFirst({
      where: {
        difficulty: targetDifficulty,
        id: {
          notIn: solvedProblems,
        },
      },
      orderBy: {
        leetcodeId: 'asc',
      },
    })

    return problem as LeetCodeProblem | null
  }

  private async generateSolution(problem: LeetCodeProblem) {
    const prompt = `
Generate a comprehensive solution for this LeetCode problem:

**Problem:** ${problem.title}
**Difficulty:** ${problem.difficulty}
**Category:** ${problem.category}
**Description:** ${problem.description}

Please provide:
1. A clean, well-commented solution in Python
2. Time and space complexity analysis
3. Step-by-step explanation of the approach
4. Alternative approaches if applicable
5. Key insights and patterns

Format the response as a markdown document suitable for a GitHub repository.
`

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert software engineer who creates educational content for LeetCode problems. Provide clear, well-structured solutions with detailed explanations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content || ''
    
    return {
      markdown: content,
      language: 'python',
      complexity: this.extractComplexity(content),
      explanation: this.extractExplanation(content),
    }
  }

  private extractComplexity(content: string): string {
    const complexityMatch = content.match(/(?:Time|Space) Complexity[:\s]*([^\n]+)/gi)
    return complexityMatch ? complexityMatch.join('\n') : 'Not specified'
  }

  private extractExplanation(content: string): string {
    const lines = content.split('\n')
    const explanationStart = lines.findIndex(line => 
      line.toLowerCase().includes('explanation') || 
      line.toLowerCase().includes('approach')
    )
    
    if (explanationStart === -1) return content
    
    return lines.slice(explanationStart).join('\n').substring(0, 1000)
  }

  private async commitToGitHub(
    token: string,
    username: string,
    problem: LeetCodeProblem,
    solution: any
  ): Promise<string> {
    // This would integrate with GitHub API to commit the solution
    // For now, return a mock path
    const date = new Date().toISOString().split('T')[0]
    const problemSlug = problem.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
    return `leetcode/${date}/${problemSlug}/solution.md`
  }
}
