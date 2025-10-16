const fs = require('fs')
const path = require('path')

const authRoutePath = path.join(__dirname, '../src/app/api/auth/[...nextauth]/route.ts')
const signupPagePath = path.join(__dirname, '../src/app/auth/signup/page.tsx')
const verifyEmailPagePath = path.join(__dirname, '../src/app/auth/verify-email/page.tsx')

function switchToFullMode() {
  console.log('🔄 Switching to full Prisma-integrated authentication mode...')
  
  try {
    // Switch NextAuth route to use full auth config
    let authRouteContent = fs.readFileSync(authRoutePath, 'utf8')
    authRouteContent = authRouteContent.replace(
      "import { authOptions } from '@/lib/auth-simple'",
      "import { authOptions } from '@/lib/auth'"
    )
    fs.writeFileSync(authRoutePath, authRouteContent)
    
    // Switch signup page to use full registration endpoint
    let signupContent = fs.readFileSync(signupPagePath, 'utf8')
    signupContent = signupContent.replace(
      "'/api/auth/register-simple'",
      "'/api/auth/register'"
    )
    fs.writeFileSync(signupPagePath, signupContent)
    
    // Switch verify email page to use full verification endpoint
    let verifyContent = fs.readFileSync(verifyEmailPagePath, 'utf8')
    verifyContent = verifyContent.replace(
      "'/api/auth/verify-email-simple'",
      "'/api/auth/verify-email'"
    )
    fs.writeFileSync(verifyEmailPagePath, verifyContent)
    
    console.log('✅ Successfully switched to full authentication mode')
    return true
  } catch (error) {
    console.error('❌ Failed to switch to full mode:', error.message)
    return false
  }
}

function switchToSimplifiedMode() {
  console.log('🔄 Switching to simplified authentication mode...')
  
  try {
    // Switch NextAuth route to use simplified auth config
    let authRouteContent = fs.readFileSync(authRoutePath, 'utf8')
    authRouteContent = authRouteContent.replace(
      "import { authOptions } from '@/lib/auth'",
      "import { authOptions } from '@/lib/auth-simple'"
    )
    fs.writeFileSync(authRoutePath, authRouteContent)
    
    // Switch signup page to use simplified registration endpoint
    let signupContent = fs.readFileSync(signupPagePath, 'utf8')
    signupContent = signupContent.replace(
      "'/api/auth/register'",
      "'/api/auth/register-simple'"
    )
    fs.writeFileSync(signupPagePath, signupContent)
    
    // Switch verify email page to use simplified verification endpoint
    let verifyContent = fs.readFileSync(verifyEmailPagePath, 'utf8')
    verifyContent = verifyContent.replace(
      "'/api/auth/verify-email'",
      "'/api/auth/verify-email-simple'"
    )
    fs.writeFileSync(verifyEmailPagePath, verifyContent)
    
    console.log('✅ Successfully switched to simplified authentication mode')
    return true
  } catch (error) {
    console.error('❌ Failed to switch to simplified mode:', error.message)
    return false
  }
}

// Check command line arguments
const mode = process.argv[2]

if (mode === 'full') {
  switchToFullMode()
} else if (mode === 'simplified') {
  switchToSimplifiedMode()
} else {
  console.log('Usage: node switch-auth-mode.js [full|simplified]')
  console.log('  full       - Switch to full Prisma-integrated authentication')
  console.log('  simplified - Switch to simplified mock authentication')
}
