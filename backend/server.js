import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import chatRouter from './routes/chat.js'
import authRouter from './routes/auth.js'
import chatsRouter from './routes/chats.js'
import errorHandler from './middleware/errorHandler.js'

dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api', chatRouter)
app.use('/api/auth', authRouter)
app.use('/api/chats', chatsRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
