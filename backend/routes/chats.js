import express from 'express'
import Chat from '../models/Chat.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Apply authentication to all routes
router.use(authenticate)

// Get all chats for user
router.get('/', async (req, res, next) => {
  try {
    const chats = await Chat.find({ userId: req.user.userId, isArchived: false })
      .sort({ updatedAt: -1 })
      .select('_id title createdAt updatedAt')

    res.json({ chats })
  } catch (error) {
    next(error)
  }
})

// Get single chat with messages
router.get('/:chatId', async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.user.userId,
    })

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    res.json({ chat })
  } catch (error) {
    next(error)
  }
})

// Create new chat
router.post('/', async (req, res, next) => {
  try {
    const { title = 'New Chat' } = req.body

    const chat = new Chat({
      userId: req.user.userId,
      title,
      messages: [],
    })

    await chat.save()

    res.status(201).json({
      chat: {
        _id: chat._id,
        title: chat.title,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Update chat title
router.patch('/:chatId', async (req, res, next) => {
  try {
    const { title } = req.body

    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.chatId, userId: req.user.userId },
      { title },
      { new: true }
    )

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    res.json({ chat })
  } catch (error) {
    next(error)
  }
})

// Delete chat
router.delete('/:chatId', async (req, res, next) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.chatId,
      userId: req.user.userId,
    })

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    res.json({ message: 'Chat deleted successfully' })
  } catch (error) {
    next(error)
  }
})

// Archive chat
router.post('/:chatId/archive', async (req, res, next) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.chatId, userId: req.user.userId },
      { isArchived: true },
      { new: true }
    )

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    res.json({ message: 'Chat archived successfully' })
  } catch (error) {
    next(error)
  }
})

export default router
