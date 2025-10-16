import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// Add error handling for debugging
export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
