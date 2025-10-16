import { NextRequest, NextResponse } from 'next/server'

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // For now, just simulate successful registration
    // In a real implementation, this would save to database
    console.log('Registration attempt:', { name, email, phone: phone || 'Not provided' })

    // Generate a mock user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Simulate email verification (in real app, this would send an actual email)
    console.log(`Verification email would be sent to: ${email}`)
    console.log(`Verification link: ${process.env.NEXTAUTH_URL}/auth/verify-email?token=mock_token_${userId}`)

    return NextResponse.json({
      message: 'Registration successful. Please check your email for verification.',
      userId,
      note: 'This is a simplified registration for testing. Check console for verification details.'
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
