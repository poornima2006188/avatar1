import express from 'express'
import { Anthropic } from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Chat from '../models/Chat.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

const DEFAULT_SYSTEM =
  'You are a friendly, expressive AI avatar assistant named Ava. Keep responses concise (2-4 sentences). Be warm, clear, and conversational. Show personality!'

// Initialize AI clients
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null

// Provider order with fallback
const PROVIDERS = ['anthropic', 'openai', 'gemini']

async function callClaude(messages, system) {
  if (!anthropic) {
    throw new Error('Claude API key not configured')
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: system || DEFAULT_SYSTEM,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  })

  return {
    reply: response.content[0].text,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
    provider: 'claude',
  }
}

async function callOpenAI(messages, system) {
  if (!openai) {
    throw new Error('OpenAI API key not configured')
  }

  const formattedMessages = [
    { role: 'system', content: system || DEFAULT_SYSTEM },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ]

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: formattedMessages,
    max_tokens: 1000,
  })

  return {
    reply: response.choices[0].message.content,
    usage: {
      input_tokens: response.usage.prompt_tokens,
      output_tokens: response.usage.completion_tokens,
    },
    provider: 'openai',
  }
}

async function callGemini(messages, system) {
  if (!genAI) {
    throw new Error('Gemini API key not configured')
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: system || DEFAULT_SYSTEM }] },
      { role: 'model', parts: [{ text: 'Understood. I am Ava, your AI avatar assistant.' }] },
    ],
  })

  const lastMessage = messages[messages.length - 1]
  const result = await chat.sendMessage(lastMessage.content)
  const response = await result.response

  return {
    reply: response.text(),
    usage: {
      input_tokens: null, // Gemini doesn't provide token counts in the same way
      output_tokens: null,
    },
    provider: 'gemini',
  }
}

async function tryProviders(messages, system, preferredProvider = null) {
  const providersToTry = preferredProvider
    ? [preferredProvider, ...PROVIDERS.filter(p => p !== preferredProvider)]
    : PROVIDERS

  const errors = []

  for (const provider of providersToTry) {
    try {
      let result
      switch (provider) {
        case 'anthropic':
          result = await callClaude(messages, system)
          break
        case 'openai':
          result = await callOpenAI(messages, system)
          break
        case 'gemini':
          result = await callGemini(messages, system)
          break
        default:
          continue
      }

      console.log(`[AI Provider] Using ${provider}`)
      return result
    } catch (error) {
      console.warn(`[AI Provider] ${provider} failed:`, error.message)
      errors.push({ provider, error: error.message })
      continue
    }
  }

  throw new Error(
    `All AI providers failed. Errors: ${errors.map(e => `${e.provider}: ${e.error}`).join(', ')}`
  )
}

// Chat endpoint with auth and fallback support
router.post('/chat', authenticate, async (req, res, next) => {
  try {
    const { messages, system, chatId, preferredProvider } = req.body

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' })
    }

    // Try providers with fallback
    const result = await tryProviders(messages, system, preferredProvider)

    // Save message to database if chatId provided
    if (chatId) {
      const chat = await Chat.findOne({
        _id: chatId,
        userId: req.user.userId,
      })

      if (chat) {
        chat.messages.push(
          { role: 'user', content: messages[messages.length - 1].content },
          { role: 'assistant', content: result.reply }
        )
        await chat.save()
      }
    }

    return res.json({
      reply: result.reply,
      usage: result.usage,
      provider: result.provider,
    })
  } catch (error) {
    console.error('[Chat Route Error]', error.message)

    if (error.message?.includes('Rate limit') || error.status === 429) {
      return res.status(429).json({
        error: 'All AI providers are rate limited. Please wait a moment and try again.',
      })
    }

    next(error)
  }
})

export default router
