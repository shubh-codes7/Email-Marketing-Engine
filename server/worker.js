import dotenv from 'dotenv'
import connectDb from './config/db.js'
import './utils/emailQueue.js'

// Load environment variables
dotenv.config()

// Connect to database
connectDb()

console.log('🚀 Email worker started')
console.log('📧 Processing email queue...')

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM, shutting down worker gracefully...')
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT, shutting down worker gracefully...')
  process.exit(0)
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