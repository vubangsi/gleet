import { loadEnvFile, validateEmailConfig } from '@/lib/env-loader'

/**
 * Test script to verify email service configuration and connectivity
 * Run with: tsx src/infrastructure/email/email-service.test.ts
 */

async function testEmailService() {
  console.log('=== Email Service Configuration Test ===\n')

  // Load environment variables from .env file
  console.log('1. Loading environment variables from .env file:')
  loadEnvFile()
  console.log('   ✓ Environment variables loaded\n')

  // Validate email configuration
  console.log('2. Validating email configuration:')
  const validation = validateEmailConfig()

  if (!validation.valid) {
    console.log('   ✗ Configuration validation failed:')
    validation.errors.forEach(error => console.log(`      - ${error}`))
    process.exit(1)
  }

  console.log('   ✓ All required email configuration variables are set\n')

  // Test email service initialization
  console.log('3. Initializing Email Service:')
  const { emailService } = await import('./email-service')
  console.log('   ✓ Email service initialized\n')

  // Wait a moment for verification to complete
  console.log('4. Waiting for SMTP connection verification...')
  await new Promise(resolve => setTimeout(resolve, 3000))

  // Test sending a test email
  console.log('\n5. Attempting to send test email:')
  const testEmail = process.env.EMAIL_FROM || 'test@example.com'
  const result = await emailService.sendEmail({
    to: testEmail,
    subject: 'Email Service Test',
    html: '<h1>Email Service Test</h1><p>If you received this, the email service is working correctly!</p>',
    text: 'Email Service Test - If you received this, the email service is working correctly!',
  })

  if (result) {
    console.log('   ✓ Test email sent successfully!')
  } else {
    console.log('   ✗ Failed to send test email')
    console.log('   Check the error logs above for details')
  }

  console.log('\n=== Test Complete ===')
}

// Run the test
testEmailService().catch(error => {
  console.error('Test failed:', error)
  process.exit(1)
})

