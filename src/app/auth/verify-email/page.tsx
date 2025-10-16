"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Bot, Mail, CheckCircle, XCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    }
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    setIsVerifying(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsVerified(true)
        toast({
          title: 'Success!',
          description: 'Your email has been verified successfully.',
        })
        
        // Redirect to sign-in after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin')
        }, 3000)
      } else {
        setError(data.error || 'Verification failed')
        toast({
          title: 'Error',
          description: data.error || 'Verification failed',
          variant: 'destructive',
        })
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Gleet</span>
          </div>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {token ? 'Verifying your email address...' : 'Check your email for the verification link'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {!token && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Check your email</h3>
                <p className="text-sm text-gray-600">
                  We've sent a verification link to your email address. 
                  Click the link to verify your account and get started.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth/signin')}
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          )}

          {token && isVerifying && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Verifying...</h3>
                <p className="text-sm text-gray-600">
                  Please wait while we verify your email address.
                </p>
              </div>
            </div>
          )}

          {token && !isVerifying && isVerified && (
            <div className="space-y-4">
              <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Email Verified!</h3>
                <p className="text-sm text-gray-600">
                  Your email has been successfully verified. You will be redirected to the sign-in page shortly.
                </p>
              </div>
              <Button 
                onClick={() => router.push('/auth/signin')}
                className="w-full"
              >
                Continue to Sign In
              </Button>
            </div>
          )}

          {token && !isVerifying && error && (
            <div className="space-y-4">
              <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Verification Failed</h3>
                <p className="text-sm text-gray-600">
                  {error}
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={() => router.push('/auth/signup')}
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/auth/signin')}
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
