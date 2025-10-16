const { PrismaClient } = require('@prisma/client')

async function initializeDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔧 Initializing database...')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Check if tables exist by trying to count users
    try {
      const userCount = await prisma.user.count()
      console.log(`✅ Database tables exist. Found ${userCount} users.`)
    } catch (error) {
      console.log('⚠️  Database tables may not exist yet. This is normal for first run.')
    }
    
    console.log('🎉 Database initialization complete!')
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

initializeDatabase()
