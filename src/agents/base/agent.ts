export interface AgentConfig {
  name: string
  type: string
  description: string
  schedule?: string
  isActive: boolean
}

export interface AgentTask {
  id: string
  type: string
  input: any
  userId: string
  scheduledAt?: Date
}

export interface AgentResult {
  success: boolean
  output?: any
  error?: string
}

export abstract class BaseAgent {
  protected config: AgentConfig

  constructor(config: AgentConfig) {
    this.config = config
  }

  abstract execute(task: AgentTask): Promise<AgentResult>

  getName(): string {
    return this.config.name
  }

  getType(): string {
    return this.config.type
  }

  isActive(): boolean {
    return this.config.isActive
  }

  getSchedule(): string | undefined {
    return this.config.schedule
  }
}
