import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // For now, just simulate successful verification
    // In a real implementation, this would check the database
    console.log('Email verification attempt with token:', token)

    // Simulate token validation
    if (token.startsWith('mock_token_')) {
      return NextResponse.json({
        message: 'Email verified successfully',
        note: 'This is a simplified verification for testing.'
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
