import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './config/db.js'
import { templateRouter } from './routes/template.route.js'
import { pipelineRouter } from './routes/pipeline.route.js'
import { contactListRouter } from './routes/contactList.route.js'
import { mailRouter } from './routes/mail.route.js'
// import './utils/emailQueue.js'
dotenv.config()
const app = express()


app.use(cors())
app.use(express.json())

app.use('/template', templateRouter)
app.use('/pipeline', pipelineRouter)
app.use('/contact', contactListRouter)
app.use('/mail', mailRouter)

app.get("/", (req, res) => {
  res.send("Server working")
})

app.listen(process.env.PORT, () => {
  connectDb()
  console.log("Server running at port", process.env.PORT);
})