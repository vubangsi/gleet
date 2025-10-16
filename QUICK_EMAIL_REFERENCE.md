# Quick Email Service Reference

## ✅ Email Service is Now Working!

The email messaging issue has been fixed. Here's what you need to know:

## Quick Start

### 1. Verify Setup
```bash
npx tsx src/infrastructure/email/email-service.test.ts
```

Expected output: `✓ Test email sent successfully!`

### 2. Check .env File
Make sure these are set:
```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

### 3. Seed Database
```bash
npm run db:seed
```

This creates email templates needed for sending emails.

## Using Email Service

### Import
```typescript
import { emailService } from '@/infrastructure/email/email-service'
```

### Send Verification Email
```typescript
await emailService.sendVerificationEmail(
  'user@example.com',
  'John Doe',
  'token-123'
)
```

### Send LeetCode Solution Email
```typescript
await emailService.sendLeetCodeSolutionEmail(
  'user@example.com',
  'John Doe',
  'Two Sum',
  'function twoSum(nums, target) { ... }',
  'https://github.com/user/repo'
)
```

### Send Open Source Email
```typescript
await emailService.sendOpenSourceContributionEmail(
  'user@example.com',
  'John Doe',
  'React',
  'Bug Fix',
  'Fix memory leak in useEffect'
)
```

### Send Profile Analysis Email
```typescript
await emailService.sendProfileAnalysisEmail(
  'user@example.com',
  'John Doe',
  85,
  ['Strong in algorithms', 'Good problem-solving'],
  ['Need more open source experience']
)
```

### Send Custom Email
```typescript
const result = await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Hello',
  html: '<h1>Hello World</h1>',
  text: 'Hello World',
})

if (result) {
  console.log('Email sent!')
} else {
  console.log('Email failed - check logs')
}
```

## What Was Fixed

| Issue | Solution |
|-------|----------|
| Env vars not loading | Created `env-loader.ts` utility |
| No connection verification | Added `verifyConnection()` method |
| Poor error logging | Enhanced with detailed context |
| Database seeding failed | Fixed with `upsert` operations |
| Missing email templates | Fixed seed script |

## Troubleshooting

### "Email template not found"
```bash
npm run db:seed
```

### "SMTP connection failed"
- Check Gmail credentials in `.env`
- Use 16-character app password, not Gmail password
- Verify 2-Factor Authentication is enabled

### "Invalid login"
- You're using wrong password
- Generate new app password at: https://myaccount.google.com/apppasswords

### "Email not sending"
```bash
# Run test to see detailed error
npx tsx src/infrastructure/email/email-service.test.ts
```

## Files to Know

| File | Purpose |
|------|---------|
| `src/infrastructure/email/email-service.ts` | Main email service |
| `src/lib/env-loader.ts` | Environment variable loader |
| `src/infrastructure/email/email-service.test.ts` | Test script |
| `EMAIL_SERVICE_SETUP.md` | Full documentation |
| `EMAIL_FIX_SUMMARY.md` | Detailed fix summary |

## Key Features

✅ Automatic environment variable loading
✅ SMTP connection verification on startup
✅ Detailed error logging
✅ Template-based emails
✅ Works in all contexts (Next.js, scripts, tests)
✅ Backward compatible

## Next Steps

1. Run `npm run db:seed` to create email templates
2. Run `npx tsx src/infrastructure/email/email-service.test.ts` to verify
3. Test email sending in your application
4. Check console logs for any issues

## Support

For detailed information, see:
- `EMAIL_SERVICE_SETUP.md` - Complete setup guide
- `EMAIL_FIX_SUMMARY.md` - Technical details of fixes

