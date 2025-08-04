import dotenv from 'dotenv'
import connectDb from './config/db.js'
import { emailWorker, emailQueue } from './utils/emailQueue.js'

dotenv.config()

;(async () => {
  await connectDb()

  console.log('🚀 Email worker started')
  console.log('📧 Processing email queue...')

  // Handle graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('🛑 Received SIGTERM, shutting down worker gracefully...')
    try {
      await emailWorker.close()
      await emailQueue.close()
      console.log('✅ Worker and queue shut down')
      process.exit(0)
    } catch (err) {
      console.error('❌ Error during shutdown:', err)
      process.exit(1)
    }
  })

  process.on('SIGINT', async () => {
    console.log('🛑 Received SIGINT, shutting down worker gracefully...')
    try {
      await emailWorker.close()
      await emailQueue.close()
      console.log('✅ Worker and queue shut down')
      process.exit(0)
    } catch (err) {
      console.error('❌ Error during shutdown:', err)
      process.exit(1)
    }
  })

  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err)
    process.exit(1)
  })

  process.on('unhandledRejection', (reason, p) => {
    console.error('❌ Unhandled Rejection at:', p, 'reason:', reason)
    process.exit(1)
  })

  // 👇 This keeps the worker alive forever
  await new Promise(() => {})
})()
