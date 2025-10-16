import { BaseAgent, AgentTask, AgentResult } from '../base/agent'
import { LeetCodeSolverAgent } from '../leetcode/leetcode-solver-agent'
import { OpenSourceContributorAgent } from '../opensource/opensource-contributor-agent'
import { ProfileEnhancerAgent } from '../profile/profile-enhancer-agent'
import { prisma } from '@/infrastructure/database/prisma-client'
import { CronJob } from 'cron'

export interface AgentRegistry {
  [key: string]: BaseAgent
}

export class AgentOrchestrator {
  private agents: AgentRegistry = {}
  private scheduledJobs: Map<string, CronJob> = new Map()

  constructor() {
    this.registerAgents()
    this.setupScheduledJobs()
  }

  private registerAgents() {
    const leetcodeSolver = new LeetCodeSolverAgent()
    const opensourceContributor = new OpenSourceContributorAgent()
    const profileEnhancer = new ProfileEnhancerAgent()

    this.agents[leetcodeSolver.getType()] = leetcodeSolver
    this.agents[opensourceContributor.getType()] = opensourceContributor
    this.agents[profileEnhancer.getType()] = profileEnhancer
  }

  private setupScheduledJobs() {
    Object.values(this.agents).forEach(agent => {
      const schedule = agent.getSchedule()
      if (schedule && agent.isActive()) {
        const job = new CronJob(
          schedule,
          () => this.executeScheduledTasks(agent.getType()),
          null,
          true,
          'America/New_York'
        )
        
        this.scheduledJobs.set(agent.getType(), job)
        console.log(`Scheduled ${agent.getName()} with cron: ${schedule}`)
      }
    })
  }

  async executeScheduledTasks(agentType: string) {
    console.log(`Executing scheduled tasks for ${agentType}`)
    
    try {
      // Get all active users
      const users = await prisma.user.findMany({
        where: { isVerified: true },
        select: { id: true, name: true, email: true },
      })

      for (const user of users) {
        await this.executeAgentTask(agentType, {
          id: crypto.randomUUID(),
          type: agentType,
          userId: user.id,
          input: {},
          scheduledAt: new Date(),
        })
      }
    } catch (error) {
      console.error(`Error executing scheduled tasks for ${agentType}:`, error)
    }
  }

  async executeAgentTask(agentType: string, task: AgentTask): Promise<AgentResult> {
    const agent = this.agents[agentType]
    if (!agent) {
      return { success: false, error: `Agent ${agentType} not found` }
    }

    // Save task to database
    const dbTask = await prisma.agentTask.create({
      data: {
        agentId: agentType,
        userId: task.userId,
        type: task.type,
        status: 'InProgress',
        input: JSON.stringify(task.input),
        scheduledAt: task.scheduledAt,
        startedAt: new Date(),
      },
    })

    try {
      // Execute the agent task
      const result = await agent.execute(task)
      
      // Update task status
      await prisma.agentTask.update({
        where: { id: dbTask.id },
        data: {
          status: result.success ? 'Completed' : 'Failed',
          output: result.output ? JSON.stringify(result.output) : null,
          error: result.error,
          completedAt: new Date(),
        },
      })

      // Send notification email if successful
      if (result.success) {
        await this.sendNotificationEmail(task.userId, agentType, result)
      }

      return result
    } catch (error) {
      // Update task with error
      await prisma.agentTask.update({
        where: { id: dbTask.id },
        data: {
          status: 'Failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date(),
        },
      })

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async executeManualTask(userId: string, agentType: string, input: any = {}): Promise<AgentResult> {
    const task: AgentTask = {
      id: crypto.randomUUID(),
      type: agentType,
      userId,
      input,
    }

    return this.executeAgentTask(agentType, task)
  }

  async getAgentStatus(agentType: string) {
    const agent = this.agents[agentType]
    if (!agent) return null

    const recentTasks = await prisma.agentTask.findMany({
      where: { agentId: agentType },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { name: true, email: true } } },
    })

    return {
      name: agent.getName(),
      type: agent.getType(),
      isActive: agent.isActive(),
      schedule: agent.getSchedule(),
      recentTasks: recentTasks.map(task => ({
        id: task.id,
        userId: task.userId,
        userName: task.user.name,
        status: task.status,
        createdAt: task.createdAt,
        completedAt: task.completedAt,
        error: task.error,
      })),
    }
  }

  async getAllAgentsStatus() {
    const statuses = await Promise.all(
      Object.keys(this.agents).map(agentType => this.getAgentStatus(agentType))
    )

    return statuses.filter(status => status !== null)
  }

  async getUserTaskHistory(userId: string, limit: number = 20) {
    const tasks = await prisma.agentTask.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        agent: { select: { name: true, type: true } },
      },
    })

    return tasks.map(task => ({
      id: task.id,
      agentName: task.agent?.name || task.agentId,
      agentType: task.agent?.type || task.agentId,
      type: task.type,
      status: task.status,
      output: task.output ? JSON.parse(task.output) : null,
      error: task.error,
      createdAt: task.createdAt,
      completedAt: task.completedAt,
    }))
  }

  private async sendNotificationEmail(userId: string, agentType: string, result: AgentResult) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      })

      if (!user) return

      // This would integrate with the email service
      // For now, we'll just log the notification
      console.log(`Email notification sent to ${user.email} for ${agentType} completion:`, result.output)
    } catch (error) {
      console.error('Error sending notification email:', error)
    }
  }

  stopAllScheduledJobs() {
    this.scheduledJobs.forEach(job => job.stop())
    this.scheduledJobs.clear()
  }

  restartScheduledJobs() {
    this.stopAllScheduledJobs()
    this.setupScheduledJobs()
  }
}

// Singleton instance
export const agentOrchestrator = new AgentOrchestrator()
