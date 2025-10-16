import { NextRequest, NextResponse } from 'next/server'
import { RegisterUserHandler } from '@/application/handlers/register-user-handler'
import { PrismaUserRepository } from '@/infrastructure/repositories/user-repository'
import { PrismaEventStore } from '@/infrastructure/events/event-store'
import { emailService } from '@/infrastructure/email/email-service'
import { prisma } from '@/infrastructure/database/prisma-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Initialize dependencies
    const userRepository = new PrismaUserRepository()
    const eventStore = new PrismaEventStore()
    const registerHandler = new RegisterUserHandler(userRepository, eventStore)

    // Execute registration
    const result = await registerHandler.handle({
      name,
      email,
      phone,
      password,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Create verification token
    const token = crypto.randomUUID()
    await prisma.verificationToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        userId: result.userId,
      },
    })

    // Send verification email
    await emailService.sendVerificationEmail(email, name, token)

    return NextResponse.json({
      message: 'Registration successful. Please check your email for verification.',
      userId: result.userId,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
