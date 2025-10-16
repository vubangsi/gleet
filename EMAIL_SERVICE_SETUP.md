# Email Service Setup and Troubleshooting Guide

## Overview

The Gleet application uses Nodemailer to send emails via Gmail SMTP. The email service has been configured with proper error handling, environment variable loading, and connection verification.

## Issues Fixed

### 1. **Environment Variables Not Loading in Node.js Scripts**
   - **Problem**: Environment variables from `.env` file were not being loaded when running standalone Node.js scripts (outside Next.js context)
   - **Solution**: Created `src/lib/env-loader.ts` utility that manually loads `.env` file variables
   - **Impact**: Email service now works in all contexts (Next.js routes, standalone scripts, tests)

### 2. **Missing SMTP Connection Verification**
   - **Problem**: Email service didn't verify SMTP connection on initialization
   - **Solution**: Added `verifyConnection()` method that runs on service initialization
   - **Impact**: Errors are caught early and logged clearly

### 3. **Insufficient Error Logging**
   - **Problem**: Email errors were logged but without enough context
   - **Solution**: Enhanced error logging with detailed information (recipient, subject, error message, stack trace)
   - **Impact**: Easier debugging when emails fail to send

### 4. **Database Seeding Issues**
   - **Problem**: Seed script used `skipDuplicates: true` which is not supported by SQLite
   - **Solution**: Replaced with `upsert` operations for each record
   - **Impact**: Database can be seeded multiple times without errors

### 5. **Missing Email Templates**
   - **Problem**: Email templates weren't being created in the database
   - **Solution**: Fixed seed script to properly create email templates
   - **Impact**: All email types (verification, LeetCode solutions, etc.) now have templates

## Configuration

### Environment Variables Required

Add these to your `.env` file:

```env
# Email - Gmail SMTP Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

### Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Copy the generated 16-character password
   - Use this as `EMAIL_SERVER_PASSWORD` in `.env`

3. **Do NOT use your regular Gmail password** - use the app-specific password

## Testing Email Service

### Run the Email Service Test

```bash
npx tsx src/infrastructure/email/email-service.test.ts
```

This will:
1. Load environment variables from `.env`
2. Validate email configuration
3. Initialize the email service
4. Verify SMTP connection
5. Send a test email to the configured sender address

### Expected Output

```
=== Email Service Configuration Test ===

1. Loading environment variables from .env file:
   ✓ Environment variables loaded

2. Validating email configuration:
   ✓ All required email configuration variables are set

3. Initializing Email Service:
   ✓ Email service initialized

4. Waiting for SMTP connection verification...
Email service: SMTP connection verified successfully

5. Attempting to send test email:
Email sent successfully: {
  to: 'your-email@gmail.com',
  subject: 'Email Service Test',
  messageId: '<...'
}
   ✓ Test email sent successfully!

=== Test Complete ===
```

## Email Service Usage

### Sending a Simple Email

```typescript
import { emailService } from '@/infrastructure/email/email-service'

const result = await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Hello',
  html: '<h1>Hello World</h1>',
  text: 'Hello World',
})

if (result) {
  console.log('Email sent successfully')
} else {
  console.log('Failed to send email - check logs for details')
}
```

### Sending Template Emails

```typescript
// Verification email
await emailService.sendVerificationEmail(
  'user@example.com',
  'John Doe',
  'verification-token-123'
)

// LeetCode solution email
await emailService.sendLeetCodeSolutionEmail(
  'user@example.com',
  'John Doe',
  'Two Sum',
  'function twoSum(nums, target) { ... }',
  'https://github.com/user/repo'
)

// Open source contribution email
await emailService.sendOpenSourceContributionEmail(
  'user@example.com',
  'John Doe',
  'React',
  'Bug Fix',
  'Fix memory leak in useEffect'
)

// Profile analysis email
await emailService.sendProfileAnalysisEmail(
  'user@example.com',
  'John Doe',
  85,
  ['Strong in algorithms', 'Good problem-solving'],
  ['Need more open source experience', 'Improve system design']
)
```

## Troubleshooting

### Email Not Sending

1. **Check environment variables are set**:
   ```bash
   npx tsx src/infrastructure/email/email-service.test.ts
   ```

2. **Verify Gmail app password**:
   - Make sure you're using the 16-character app password, not your regular Gmail password
   - Check that 2-Factor Authentication is enabled on your Gmail account

3. **Check email logs**:
   - Look for error messages in the console output
   - The email service logs detailed error information

4. **Verify SMTP connection**:
   - The test script will verify the SMTP connection
   - If verification fails, check your Gmail credentials

### Common Errors

**"Invalid login: 535-5.7.8 Username and password not accepted"**
- You're using the wrong password
- Use the 16-character app password, not your Gmail password

**"SMTP connection verification failed"**
- Check that EMAIL_SERVER_HOST, EMAIL_SERVER_USER, and EMAIL_SERVER_PASSWORD are correct
- Verify 2-Factor Authentication is enabled on Gmail

**"Email template 'email-verification' not found"**
- Run `npm run db:seed` to create email templates in the database

## Files Modified/Created

- `src/infrastructure/email/email-service.ts` - Enhanced with better error handling and verification
- `src/lib/env-loader.ts` - New utility for loading environment variables
- `src/infrastructure/email/email-service.test.ts` - Test script for email service
- `prisma/seed.ts` - Fixed to properly seed email templates and other data
- `EMAIL_SERVICE_SETUP.md` - This documentation file

## Next Steps

1. Ensure `.env` file has correct Gmail credentials
2. Run `npm run db:seed` to create email templates
3. Run `npx tsx src/infrastructure/email/email-service.test.ts` to verify setup
4. Test email sending in your application

