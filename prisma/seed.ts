import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create email templates
  const emailTemplates = [
      {
        name: 'email-verification',
        subject: 'Verify your email - {{appName}}',
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 Welcome to {{appName}}!</h1>
        </div>
        <div class="content">
            <h2>Hi {{name}},</h2>
            <p>Thank you for joining {{appName}}! We're excited to help you accelerate your coding journey with AI-powered agents.</p>
            <p>To get started, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
                <a href="{{verificationUrl}}" class="button">Verify Email Address</a>
            </div>
            <p>Once verified, you'll be able to:</p>
            <ul>
                <li>🎯 Get daily LeetCode solutions with detailed explanations</li>
                <li>🚀 Discover and contribute to open source projects</li>
                <li>📈 Receive personalized profile enhancement suggestions</li>
                <li>🔗 Integrate with GitHub for automatic commits</li>
            </ul>
            <p>If you didn't create this account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>© 2024 {{appName}}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
        textContent: `
Hi {{name}},

Welcome to {{appName}}! Please verify your email address by visiting: {{verificationUrl}}

Once verified, you'll have access to AI-powered coding assistance, LeetCode solutions, and open source contribution opportunities.

If you didn't create this account, you can safely ignore this email.

© 2024 {{appName}}. All rights reserved.
        `,
        variables: JSON.stringify(['name', 'verificationUrl', 'appName']),
      },
      {
        name: 'leetcode-solution',
        subject: '🎯 New LeetCode Solution: {{problemTitle}}',
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LeetCode Solution</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .solution-box { background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #10b981; margin: 20px 0; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 New LeetCode Solution Ready!</h1>
        </div>
        <div class="content">
            <h2>Hi {{name}},</h2>
            <p>Your AI agent has generated a new solution for today's LeetCode problem:</p>
            
            <div class="solution-box">
                <h3>{{problemTitle}}</h3>
                <p>{{solution}}</p>
            </div>

            <p>The complete solution with detailed explanations has been prepared for you.</p>
            
            <div style="text-align: center;">
                {{#hasGithubUrl}}
                <a href="{{githubUrl}}" class="button">View on GitHub</a>
                {{/hasGithubUrl}}
                <a href="https://gleet.app/dashboard" class="button">View Dashboard</a>
            </div>

            <p><strong>Keep up the great work!</strong> Consistent practice is key to mastering algorithms and data structures.</p>
        </div>
        <div class="footer">
            <p>© 2024 Gleet. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
        textContent: `
Hi {{name}},

Your AI agent has generated a new LeetCode solution: {{problemTitle}}

{{solution}}

{{#hasGithubUrl}}
View on GitHub: {{githubUrl}}
{{/hasGithubUrl}}

View your dashboard: https://gleet.app/dashboard

Keep up the great work!

© 2024 Gleet. All rights reserved.
        `,
        variables: JSON.stringify(['name', 'problemTitle', 'solution', 'githubUrl', 'hasGithubUrl']),
      },
      {
        name: 'opensource-contribution',
        subject: '🚀 New Open Source Opportunity: {{projectName}}',
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Open Source Contribution</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .project-box { background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #8b5cf6; margin: 20px 0; }
        .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 New Contribution Opportunity!</h1>
        </div>
        <div class="content">
            <h2>Hi {{name}},</h2>
            <p>Your AI agent has found an exciting open source contribution opportunity:</p>
            
            <div class="project-box">
                <h3>{{projectName}}</h3>
                <p><strong>Contribution Type:</strong> {{contributionType}}</p>
                <p><strong>Suggested Task:</strong> {{contributionTitle}}</p>
            </div>

            <p>This project matches your skill level and interests. Contributing to open source projects is a great way to:</p>
            <ul>
                <li>Build your portfolio and gain real-world experience</li>
                <li>Connect with other developers in the community</li>
                <li>Learn new technologies and best practices</li>
                <li>Make a positive impact on projects used by others</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="https://gleet.app/dashboard/contributions" class="button">View Details</a>
                <a href="https://gleet.app/dashboard" class="button">Dashboard</a>
            </div>

            <p>Ready to make your mark on the open source community? 🌟</p>
        </div>
        <div class="footer">
            <p>© 2024 Gleet. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
        textContent: `
Hi {{name}},

Your AI agent has found a new open source contribution opportunity:

Project: {{projectName}}
Contribution Type: {{contributionType}}
Suggested Task: {{contributionTitle}}

View details: https://gleet.app/dashboard/contributions
Dashboard: https://gleet.app/dashboard

Ready to make your mark on the open source community?

© 2024 Gleet. All rights reserved.
        `,
        variables: JSON.stringify(['name', 'projectName', 'contributionType', 'contributionTitle']),
      },
      {
        name: 'profile-analysis',
        subject: '📈 Your Developer Profile Analysis is Ready',
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Analysis</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .score-box { background: white; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0; border: 2px solid #f59e0b; }
        .score { font-size: 48px; font-weight: bold; color: #f59e0b; }
        .section { background: white; padding: 20px; border-radius: 6px; margin: 15px 0; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📈 Profile Analysis Complete!</h1>
        </div>
        <div class="content">
            <h2>Hi {{name}},</h2>
            <p>Your AI agent has completed a comprehensive analysis of your developer profile:</p>
            
            <div class="score-box">
                <div class="score">{{profileScore}}/100</div>
                <p><strong>Overall Profile Score</strong></p>
            </div>

            <div class="section">
                <h3>🌟 Your Strengths</h3>
                <p>{{strengthsList}}</p>
            </div>

            <div class="section">
                <h3>🎯 Areas for Improvement</h3>
                <p>{{improvementsList}}</p>
            </div>

            <p>Based on this analysis, personalized enhancement tasks have been created to help you improve your developer profile and career prospects.</p>
            
            <div style="text-align: center;">
                <a href="https://gleet.app/dashboard/profile" class="button">View Full Analysis</a>
                <a href="https://gleet.app/dashboard" class="button">Dashboard</a>
            </div>

            <p>Keep growing and building your developer brand! 🚀</p>
        </div>
        <div class="footer">
            <p>© 2024 Gleet. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
        textContent: `
Hi {{name}},

Your developer profile analysis is complete!

Profile Score: {{profileScore}}/100

Strengths: {{strengthsList}}

Areas for Improvement: {{improvementsList}}

View full analysis: https://gleet.app/dashboard/profile
Dashboard: https://gleet.app/dashboard

Keep growing and building your developer brand!

© 2024 Gleet. All rights reserved.
        `,
        variables: JSON.stringify(['name', 'profileScore', 'strengthsList', 'improvementsList']),
      },
    ]

  // Create email templates (handle duplicates manually)
  for (const template of emailTemplates) {
    try {
      await prisma.emailTemplate.upsert({
        where: { name: template.name },
        update: template,
        create: template,
      })
    } catch (error) {
      console.log(`Email template '${template.name}' already exists or error occurred`)
    }
  }

  // Create sample LeetCode problems
  const leetcodeProblems = [
      {
        leetcodeId: 1,
        title: 'Two Sum',
        difficulty: 'Easy',
        category: 'Array',
        tags: JSON.stringify(['Array', 'Hash Table']),
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        examples: JSON.stringify([
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
          { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
        ]),
      },
      {
        leetcodeId: 121,
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        category: 'Array',
        tags: JSON.stringify(['Array', 'Dynamic Programming']),
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day.',
        examples: JSON.stringify([
          { input: 'prices = [7,1,5,3,6,4]', output: '5' },
          { input: 'prices = [7,6,4,3,1]', output: '0' }
        ]),
      },
      {
        leetcodeId: 206,
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        category: 'Linked List',
        tags: JSON.stringify(['Linked List', 'Recursion']),
        description: 'Given the head of a singly linked list, reverse the list and return the reversed list.',
        examples: JSON.stringify([
          { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
          { input: 'head = [1,2]', output: '[2,1]' }
        ]),
      },
    ]

  // Create LeetCode problems (handle duplicates manually)
  for (const problem of leetcodeProblems) {
    try {
      await prisma.leetcodeProblem.upsert({
        where: { leetcodeId: problem.leetcodeId },
        update: problem,
        create: problem,
      })
    } catch (error) {
      console.log(`LeetCode problem '${problem.title}' already exists or error occurred`)
    }
  }

  // Create agents
  const agents = [
      {
        id: 'leetcode-solver',
        name: 'LeetCode Solver',
        type: 'LeetcodeSolver',
        description: 'Generates solutions for LeetCode problems with detailed explanations',
        isActive: true,
        config: JSON.stringify({
          dailyLimit: 1,
          difficultyProgression: true,
          languages: ['python', 'javascript', 'java'],
        }),
        schedule: '0 9 * * *', // Daily at 9 AM
      },
      {
        id: 'opensource-contributor',
        name: 'Open Source Contributor',
        type: 'OpenSourceContributor',
        description: 'Finds and contributes to open source projects',
        isActive: true,
        config: JSON.stringify({
          maxProjectsPerDay: 3,
          preferredLanguages: ['typescript', 'javascript', 'python'],
          minStars: 50,
          maxStars: 1000,
        }),
        schedule: '0 10 * * *', // Daily at 10 AM
      },
      {
        id: 'profile-enhancer',
        name: 'Profile Enhancer',
        type: 'ProfileEnhancer',
        description: 'Analyzes and suggests improvements for developer profiles',
        isActive: true,
        config: JSON.stringify({
          analysisFrequency: 'weekly',
          includeGitHubStats: true,
          generatePortfolio: true,
        }),
        schedule: '0 11 * * 1', // Weekly on Mondays at 11 AM
      },
    ]

  // Create agents (handle duplicates manually)
  for (const agent of agents) {
    try {
      await prisma.agent.upsert({
        where: { id: agent.id },
        update: agent,
        create: agent,
      })
    } catch (error) {
      console.log(`Agent '${agent.name}' already exists or error occurred`)
    }
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
