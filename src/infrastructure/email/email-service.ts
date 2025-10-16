import nodemailer from 'nodemailer'
import { prisma } from '../database/prisma-client'
import { loadEnvFile, validateEmailConfig } from '@/lib/env-loader'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export interface TemplateVariables {
  [key: string]: string | number | boolean
}

export class EmailService {
  private transporter: nodemailer.Transporter
  private isVerified: boolean = false

  constructor() {
    // Ensure environment variables are loaded
    loadEnvFile()

    // Validate email configuration
    const validation = validateEmailConfig()
    if (!validation.valid) {
      console.error('Email service: Configuration validation failed:')
      validation.errors.forEach(error => console.error(`  - ${error}`))
      console.warn('Email service will not be able to send emails until configuration is fixed')
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    // Verify transporter connection on initialization
    this.verifyConnection()
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify()
      this.isVerified = true
      console.log('Email service: SMTP connection verified successfully')
    } catch (error) {
      console.error('Email service: SMTP connection verification failed:', error)
      this.isVerified = false
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.isVerified) {
        console.warn('Email service: Transporter not verified, attempting to verify...')
        await this.verifyConnection()
        if (!this.isVerified) {
          throw new Error('Email transporter is not properly configured')
        }
      }

      const result = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      })

      console.log('Email sent successfully:', {
        to: options.to,
        subject: options.subject,
        messageId: result.messageId,
      })
      return true
    } catch (error) {
      console.error('Error sending email:', {
        to: options.to,
        subject: options.subject,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
      return false
    }
  }

  async sendTemplateEmail(
    templateName: string,
    to: string,
    variables: TemplateVariables
  ): Promise<boolean> {
    try {
      const template = await prisma.emailTemplate.findUnique({
        where: { name: templateName },
      })

      if (!template) {
        console.error(`Email template '${templateName}' not found in database`)
        throw new Error(`Email template '${templateName}' not found`)
      }

      const subject = this.replaceVariables(template.subject, variables)
      const html = this.replaceVariables(template.htmlContent, variables)
      const text = template.textContent
        ? this.replaceVariables(template.textContent, variables)
        : undefined

      console.log(`Sending template email: ${templateName} to ${to}`)
      return await this.sendEmail({ to, subject, html, text })
    } catch (error) {
      console.error('Error sending template email:', {
        templateName,
        to,
        error: error instanceof Error ? error.message : String(error),
      })
      return false
    }
  }

  private replaceVariables(content: string, variables: TemplateVariables): string {
    let result = content
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
      result = result.replace(regex, String(value))
    })
    return result
  }

  async sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`
    
    return this.sendTemplateEmail('email-verification', email, {
      name,
      verificationUrl,
      appName: 'Gleet',
    })
  }

  async sendLeetCodeSolutionEmail(
    email: string,
    name: string,
    problemTitle: string,
    solution: string,
    githubUrl?: string
  ): Promise<boolean> {
    return this.sendTemplateEmail('leetcode-solution', email, {
      name,
      problemTitle,
      solution: solution.substring(0, 500) + '...', // Truncate for email
      githubUrl: githubUrl || '#',
      hasGithubUrl: githubUrl ? 'true' : 'false',
    })
  }

  async sendOpenSourceContributionEmail(
    email: string,
    name: string,
    projectName: string,
    contributionType: string,
    contributionTitle: string
  ): Promise<boolean> {
    return this.sendTemplateEmail('opensource-contribution', email, {
      name,
      projectName,
      contributionType,
      contributionTitle,
    })
  }

  async sendProfileAnalysisEmail(
    email: string,
    name: string,
    profileScore: number,
    strengths: string[],
    improvements: string[]
  ): Promise<boolean> {
    return this.sendTemplateEmail('profile-analysis', email, {
      name,
      profileScore,
      strengthsList: strengths.join(', '),
      improvementsList: improvements.join(', '),
    })
  }
}

export const emailService = new EmailService()
