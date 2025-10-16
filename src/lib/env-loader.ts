import fs from 'fs'
import path from 'path'

/**
 * Load environment variables from .env file
 * This is useful for scripts that run outside of Next.js context
 */
export function loadEnvFile(): void {
  const envPath = path.resolve(process.cwd(), '.env')
  
  if (!fs.existsSync(envPath)) {
    console.warn(`Warning: .env file not found at ${envPath}`)
    return
  }

  const envContent = fs.readFileSync(envPath, 'utf-8')
  const lines = envContent.split('\n')

  lines.forEach(line => {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) {
      return
    }

    const [key, ...valueParts] = line.split('=')
    const trimmedKey = key.trim()
    const value = valueParts.join('=').trim()

    // Remove quotes if present
    const cleanValue = value.replace(/^["']|["']$/g, '')

    // Only set if not already set (process.env takes precedence)
    if (!process.env[trimmedKey]) {
      process.env[trimmedKey] = cleanValue
    }
  })
}

/**
 * Get email configuration from environment variables
 */
export function getEmailConfig() {
  return {
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
    user: process.env.EMAIL_SERVER_USER,
    password: process.env.EMAIL_SERVER_PASSWORD,
    from: process.env.EMAIL_FROM,
  }
}

/**
 * Validate email configuration
 */
export function validateEmailConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const config = getEmailConfig()

  if (!config.host) errors.push('EMAIL_SERVER_HOST is not set')
  if (!config.user) errors.push('EMAIL_SERVER_USER is not set')
  if (!config.password) errors.push('EMAIL_SERVER_PASSWORD is not set')
  if (!config.from) errors.push('EMAIL_FROM is not set')

  return {
    valid: errors.length === 0,
    errors,
  }
}

