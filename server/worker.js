import dotenv from 'dotenv'
import connectDb from './config/db.js'
import { emailWorker, emailQueue } from './utils/emailQueue.js'

// Load environment variables
dotenv.config()

// Connect to database
connectDb()

console.log('🚀 Email worker started')
console.log('📧 Processing email queue...')

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM, shutting down worker gracefully...')
  
  try {
    // Close the email worker gracefully
    await emailWorker.close()
    console.log('✅ Email worker closed successfully')
    
    // Close the queue
    await emailQueue.close()
    console.log('✅ Email queue closed successfully')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error)
    process.exit(1)
  }
})

process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT, shutting down worker gracefully...')
  
  try {
    // Close the email worker gracefully
    await emailWorker.close()
    console.log('✅ Email worker closed successfully')
    
    // Close the queue
    await emailQueue.close()
    console.log('✅ Email queue closed successfully')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error)
    process.exit(1)
  }
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})