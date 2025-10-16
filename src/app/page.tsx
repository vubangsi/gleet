import { Button } from '@/components/ui/button'
import { ArrowRight, Code, GitBranch, TrendingUp, Zap, Bot, Target } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Gleet</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Developer
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Growth Platform
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Accelerate your coding journey with intelligent agents that solve LeetCode problems, 
            contribute to open source projects, and enhance your developer profile automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Intelligent Agents Working for You
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI agents work around the clock to improve your coding skills and developer profile
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* LeetCode Solver */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Code className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              LeetCode Problem Solver
            </h3>
            <p className="text-gray-600 mb-6">
              Daily AI-generated solutions with detailed explanations, automatically committed to your GitHub repository.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Intelligent problem selection based on your progress</li>
              <li>• Comprehensive solutions with complexity analysis</li>
              <li>• Automatic GitHub integration</li>
              <li>• Email summaries with learning insights</li>
            </ul>
          </div>

          {/* Open Source Contributor */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <GitBranch className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Open Source Contributor
            </h3>
            <p className="text-gray-600 mb-6">
              Discover and contribute to open source projects that match your skill level and interests.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Smart project discovery and analysis</li>
              <li>• Contribution opportunity identification</li>
              <li>• Automated pull request suggestions</li>
              <li>• Community engagement tracking</li>
            </ul>
          </div>

          {/* Profile Enhancer */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Profile Enhancer
            </h3>
            <p className="text-gray-600 mb-6">
              Comprehensive analysis and optimization of your developer profile and portfolio.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• GitHub profile optimization</li>
              <li>• Portfolio website generation</li>
              <li>• Skill gap analysis and recommendations</li>
              <li>• Career advancement insights</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and let our AI agents accelerate your growth
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600 text-sm">
                Create your account and verify your email
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Connect GitHub</h3>
              <p className="text-gray-600 text-sm">
                Link your GitHub account and provide access token
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Agents Activate</h3>
              <p className="text-gray-600 text-sm">
                Our agents start working on your behalf daily
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600 text-sm">
                Monitor your growth through the dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Agent Ideas */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            More AI Agents Coming Soon
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're constantly developing new agents to boost your developer profile
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <Target className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Interview Prep Agent</h3>
            <p className="text-gray-600 text-sm">
              Generates personalized coding interview questions and tracks your preparation progress.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <Zap className="h-8 w-8 text-yellow-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Tech Blog Writer</h3>
            <p className="text-gray-600 text-sm">
              Creates technical blog posts about your projects and learning journey.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <Bot className="h-8 w-8 text-indigo-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Code Review Agent</h3>
            <p className="text-gray-600 text-sm">
              Analyzes your code quality and suggests improvements and best practices.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <TrendingUp className="h-8 w-8 text-pink-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Skill Tracker</h3>
            <p className="text-gray-600 text-sm">
              Monitors trending technologies and suggests learning paths based on job market demands.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <GitBranch className="h-8 w-8 text-teal-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Project Generator</h3>
            <p className="text-gray-600 text-sm">
              Creates project ideas and starter templates based on your skill level and interests.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <Code className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Networking Assistant</h3>
            <p className="text-gray-600 text-sm">
              Finds networking opportunities, conferences, and connects you with like-minded developers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Accelerate Your Growth?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already using AI agents to boost their careers.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/signup">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6" />
              <span className="text-xl font-bold">Gleet</span>
            </div>
            <p className="text-gray-400">
              © 2024 Gleet. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
