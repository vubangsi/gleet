# 🤖 Gleet - AI-Powered Developer Growth Platform

Gleet is a modern, agentic application that accelerates your coding journey through intelligent AI agents. Built with Domain-Driven Design (DDD), Event-Driven Architecture, CQRS, and multi-agent orchestration.

## ✨ Features

### 🎯 Core AI Agents

1. **LeetCode Solver Agent**
   - Daily AI-generated solutions with detailed explanations
   - Intelligent problem selection based on your progress
   - Automatic GitHub repository commits
   - Email summaries with learning insights

2. **Open Source Contributor Agent**
   - Discovers suitable open source projects
   - Analyzes contribution opportunities
   - Suggests meaningful contributions based on your skill level
   - Tracks community engagement

3. **Profile Enhancer Agent**
   - Comprehensive developer profile analysis
   - GitHub profile optimization suggestions
   - Portfolio website generation
   - Career advancement insights

### 🚀 Additional Planned Agents

- **Interview Prep Agent**: Personalized coding interview preparation
- **Tech Blog Writer**: Automated technical blog post generation
- **Code Review Agent**: Code quality analysis and improvement suggestions
- **Skill Tracker**: Trending technology monitoring and learning paths
- **Project Generator**: Custom project ideas and starter templates
- **Networking Assistant**: Developer community and conference recommendations

## 🏗️ Architecture

### Domain-Driven Design (DDD)
- **Domain Layer**: Core business logic and entities
- **Application Layer**: CQRS commands, queries, and handlers
- **Infrastructure Layer**: Database, external services, and repositories

### Event-Driven Architecture
- Domain events for loose coupling
- Event store for audit trails
- Asynchronous event processing

### CQRS (Command Query Responsibility Segregation)
- Separate read and write models
- Optimized query performance
- Clear separation of concerns

### Multi-Agent Orchestration
- Centralized agent management
- Scheduled task execution
- Real-time monitoring and status tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with email verification
- **UI**: Tailwind CSS + shadcn/ui components
- **AI**: OpenAI GPT-4 for intelligent content generation
- **Email**: Nodemailer with Gmail SMTP
- **Scheduling**: Cron jobs for automated tasks
- **State Management**: Zustand
- **Validation**: Zod

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Gmail app password for email service

### Quick Start

**🚀 One-Command Startup (Recommended)**

```bash
# For macOS/Linux
./start.sh

# For Windows
start.bat

# Or using npm
npm run start:full
```

The startup script will automatically:
- Kill any existing process on port 3000
- Install dependencies if needed
- **Generate Prisma client** and set up database
- **Auto-switch authentication mode** based on database availability
- Seed the database with initial data
- Start the development server

**🎯 Smart Mode Switching:**
- If database setup succeeds → **Full Mode** (real authentication with Prisma)
- If database setup fails → **Simplified Mode** (mock authentication for testing)

### Manual Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gleet
   ```

2. **Set up environment variables**
   Update the `.env` file with your credentials:
   ```env
   # Database
   DATABASE_URL="file:./prisma/dev.db"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-replace-with-random-string"

   # GitHub OAuth (optional)
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"

   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"

   # Email - Gmail SMTP
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=465
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Authentication Mode Management

You can manually switch between authentication modes:

```bash
# Switch to full database-integrated authentication
npm run auth:full

# Switch to simplified mock authentication  
npm run auth:simple

# Check current application status
./check-status.sh
```

**Full Mode Features:**
- Real user registration with database storage
- Email verification with tokens
- Session management with Prisma
- GitHub OAuth integration

**Simplified Mode Features:**
- Mock user registration (no database required)
- Simulated email verification
- Console logging for debugging
- Works without any external dependencies

## 📊 Database Schema

The application uses a comprehensive database schema with the following key entities:

- **Users**: User accounts with GitHub integration
- **LeetCode Problems & Solutions**: Problem database and generated solutions
- **Open Source Projects & Contributions**: Project discovery and contribution tracking
- **Agents & Agent Tasks**: Multi-agent system management
- **Domain Events**: Event sourcing for audit trails
- **Email Templates**: Beautiful, responsive email templates

## 🤖 Agent System

### Agent Orchestrator
The central orchestration system manages all AI agents:

- **Scheduling**: Cron-based task scheduling
- **Execution**: Parallel and sequential task execution
- **Monitoring**: Real-time status tracking and error handling
- **Notifications**: Email notifications for completed tasks

### Agent Development
Each agent extends the `BaseAgent` class and implements:

```typescript
abstract class BaseAgent {
  abstract execute(task: AgentTask): Promise<AgentResult>
}
```

## 📧 Email System

Beautiful, responsive email templates for:
- Email verification
- LeetCode solution summaries
- Open source contribution notifications
- Profile analysis reports

## 🔐 Authentication

- Email/password authentication with verification
- GitHub OAuth integration
- Session management with NextAuth.js
- Protected routes and API endpoints

## 🎨 UI/UX

- Modern, responsive design with Tailwind CSS
- Dark/light theme support
- Accessible components with Radix UI
- Beautiful animations with Framer Motion
- Toast notifications for user feedback

## 📱 Pages & Features

### Landing Page
- Hero section with feature highlights
- Agent showcase and benefits
- How it works section
- Future agent roadmap

### Authentication
- Sign up with email verification
- Sign in with credentials or GitHub
- Password reset functionality

### Dashboard (Coming Soon)
- Agent status and recent activities
- LeetCode progress tracking
- Open source contribution history
- Profile analysis insights

## 🚀 Deployment

The application is designed for easy deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Self-hosted with Docker

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:
- Code style and conventions
- Pull request process
- Issue reporting
- Feature requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for powerful AI capabilities
- The open source community for amazing tools and libraries
- All contributors and users of the platform

---

**Ready to accelerate your developer growth with AI? Get started today!** 🚀
