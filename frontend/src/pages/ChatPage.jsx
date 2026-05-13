import React, { useReducer, useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import avatarReducer, { initialState } from '../state/avatarReducer'
import useClaude from '../hooks/useClaude'
import useSpeech from '../hooks/useSpeech'
import useAvatarBlink from '../hooks/useAvatarBlink'
import detectSentiment, { getSentimentLabel } from '../utils/sentiment'
import AvatarSVG from '../components/AvatarSVG'
import CatAvatar from '../components/CatAvatar'
import SpongeAvatar from '../components/SpongeAvatar'
import CustomizerPanel from '../components/CustomizerPanel'
import SpeechBubble from '../components/SpeechBubble'
import ChatHistory from '../components/ChatHistory'
import ChatInput from '../components/ChatInput'
import Sidebar from '../components/Sidebar'

const SYSTEM_PROMPT = "You are a friendly, expressive AI avatar assistant named Ava. Keep responses concise (2-4 sentences). Be warm, clear, and conversational. Show personality! Use varied vocabulary to express emotions naturally."

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function ChatPage() {
  const navigate = useNavigate()
  const { user, token, logout } = useAuth()
  const [state, dispatch] = useReducer(avatarReducer, initialState)
  const [currentChatId, setCurrentChatId] = useState(null)
  const [hasStarted, setHasStarted] = useState(false)
  const greetedRef = React.useRef(false)

  const { ask, isLoading, clearHistory } = useClaude(SYSTEM_PROMPT, token)
  const { speak, stop, voices, selectedVoice, setVoice, isSupported } = useSpeech(dispatch, token)
  useAvatarBlink(dispatch)

  // Redirect if not authenticated
  useEffect(() => {
    if (!token && !user) {
      navigate('/login')
    }
  }, [token, user, navigate])

  // Load user avatar preferences
  useEffect(() => {
    if (user?.avatar) {
      dispatch({ type: 'LOAD_SAVED', payload: user.avatar })
    }
  }, [user])

  // Save appearance changes to backend
  useEffect(() => {
    const saveAvatar = async () => {
      if (!token) return

      const appearance = {
        skin: state.skin,
        hair: state.hair,
        eye: state.eye,
        lip: state.lip,
        acc: state.acc,
        hairStyle: state.hairStyle,
        theme: state.theme,
        avatarType: state.avatarType,
      }

      try {
        await fetch(`${API_URL}/api/auth/avatar`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(appearance),
        })
      } catch (error) {
        console.error('Failed to save avatar:', error)
      }
    }

    const timeoutId = setTimeout(saveAvatar, 500)
    return () => clearTimeout(timeoutId)
  }, [state.skin, state.hair, state.eye, state.lip, state.acc, state.hairStyle, state.theme, state.avatarType, token])

  // Sync voices
  useEffect(() => {
    dispatch({ type: 'SET_VOICES', payload: voices })
    dispatch({ type: 'SET_VOICE', payload: selectedVoice })
  }, [voices, selectedVoice])

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  const handleStart = useCallback(() => {
    setHasStarted(true)
    if (!isSupported || greetedRef.current) return
    greetedRef.current = true
    const GREETING = `Hi ${user?.name || 'there'}! I am Ava, your AI avatar assistant. How can I help you today?`
    dispatch({ type: 'SET_BUBBLE', payload: GREETING })
    dispatch({ type: 'SET_EXPR', payload: 'happy' })
    speak(GREETING, {
      onEnd: () => {
        dispatch({ type: 'SET_EXPR', payload: 'neutral' })
        dispatch({ type: 'SET_STATUS', payload: 'Ready' })
        setTimeout(() => {
          dispatch({ type: 'SET_BUBBLE', payload: 'Ask me anything — I am listening!' })
        }, 2000)
      },
    })
  }, [isSupported, speak, user])

  const createNewChat = async () => {
    if (!token) return

    try {
      const response = await fetch(`${API_URL}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: 'New Chat' }),
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentChatId(data.chat._id)
        dispatch({ type: 'CLEAR_CHAT' })
        clearHistory()
      }
    } catch (error) {
      console.error('Failed to create chat:', error)
    }
  }

  const loadChat = async (chatId) => {
    if (!token) return

    setCurrentChatId(chatId)

    try {
      const response = await fetch(`${API_URL}/api/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'CLEAR_CHAT' })
        data.chat.messages.forEach((msg) => {
          dispatch({ type: 'ADD_MESSAGE', payload: msg })
        })
      }
    } catch (error) {
      console.error('Failed to load chat:', error)
    }
  }

  const handleSend = useCallback(async (text) => {
    dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', content: text } })
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_EXPR', payload: 'thinking' })
    dispatch({ type: 'SET_STATUS', payload: 'Thinking...' })
    dispatch({ type: 'SET_BUBBLE', payload: '...' })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const reply = await ask(text, currentChatId)
      const sentiment = detectSentiment(reply)
      dispatch({ type: 'ADD_MESSAGE', payload: { role: 'assistant', content: reply } })
      dispatch({ type: 'SET_BUBBLE', payload: reply })
      dispatch({ type: 'SET_STATUS', payload: getSentimentLabel(reply) })
      dispatch({ type: 'SET_LOADING', payload: false })
      dispatch({ type: 'SET_EXPR', payload: sentiment })

      if (isSupported) {
        speak(reply, {
          onStart: () => {},
          onEnd: () => {
            dispatch({ type: 'SET_EXPR', payload: 'neutral' })
            dispatch({ type: 'SET_STATUS', payload: 'Ready' })
          },
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      dispatch({ type: 'SET_EXPR', payload: 'sad' })
      dispatch({ type: 'SET_LOADING', payload: false })

      let errorMessage = 'Oops, something went wrong. Please try again.'
      let statusMessage = 'Error'

      if (error.message?.includes('Rate limit')) {
        errorMessage = "I'm getting too many requests. Please wait a moment!"
        statusMessage = 'Rate limited'
      } else if (error.message?.includes('Connection') || error.name === 'TypeError') {
        errorMessage = 'Connection issue. Please check your internet and try again.'
        statusMessage = 'Connection error'
      }

      dispatch({ type: 'SET_BUBBLE', payload: errorMessage })
      dispatch({ type: 'SET_STATUS', payload: statusMessage })
      dispatch({ type: 'SET_ERROR', payload: true })

      setTimeout(() => {
        dispatch({ type: 'SET_EXPR', payload: 'neutral' })
        dispatch({ type: 'SET_STATUS', payload: 'Ready' })
        dispatch({ type: 'SET_ERROR', payload: null })
      }, 2000)
    }
  }, [ask, speak, isSupported, currentChatId])

  const avatarProps = {
    skin: state.skin,
    skinShade: state.skinShade,
    hair: state.hair,
    eye: state.eye,
    lip: state.lip,
    acc: state.acc,
    hairStyle: state.hairStyle,
    expr: state.expr,
    blinking: state.blinking,
    speaking: state.speaking,
  }

  return (
    <div className="chat-page">
      <Sidebar
        currentChatId={currentChatId}
        onChatSelect={loadChat}
        onNewChat={createNewChat}
      />

      <main className="chat-main">
        {/* Welcome overlay */}
        {!hasStarted && (
          <div className="welcome-overlay" onClick={handleStart}>
            <div className="welcome-content">
              <div className="welcome-avatar">
                {state.avatarType === 'cat' ? (
                  <CatAvatar speaking={false} />
                ) : state.avatarType === 'spongebob' ? (
                  <SpongeAvatar speaking={false} />
                ) : (
                  <AvatarSVG {...avatarProps} />
                )}
              </div>
              <h1>Welcome back, {user?.name || 'friend'}! 👋</h1>
              <p>Meet Ava, your AI avatar assistant</p>
              <div className="welcome-btn">
                ▶ Click anywhere to start
              </div>
            </div>
          </div>
        )}

        {state.isCustomizing ? (
          <CustomizerView
            state={state}
            dispatch={dispatch}
            avatarProps={avatarProps}
          />
        ) : (
          <ChatView
            state={state}
            dispatch={dispatch}
            avatarProps={avatarProps}
            onSend={handleSend}
            isLoading={isLoading}
          />
        )}
      </main>

      <style>{`
        .chat-page {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: var(--bg-primary);
        }

        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        .welcome-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .welcome-content {
          text-align: center;
          color: white;
        }

        .welcome-avatar {
          transform: scale(2);
          margin-bottom: 40px;
        }

        .welcome-content h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .welcome-content p {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 32px;
        }

        .welcome-btn {
          display: inline-block;
          padding: 16px 40px;
          background: var(--accent);
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.5);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}

function CustomizerView({ state, dispatch, avatarProps }) {
  return (
    <div className="customizer-view">
      <div className="customizer-content">
        {/* Avatar Stage with Swirl Select */}
        <div className="avatar-stage">
          <button 
            className="nav-arrow left" 
            onClick={() => {
              const types = ['human', 'cat', 'spongebob']
              const idx = types.indexOf(state.avatarType)
              const nextIdx = (idx - 1 + types.length) % types.length
              dispatch({ type: 'SET_AVATAR_TYPE', payload: types[nextIdx] })
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <div className="avatar-breathe" style={{ transform: 'scale(2.2)' }}>
            {state.avatarType === 'cat' ? (
              <CatAvatar speaking={state.speaking} />
            ) : state.avatarType === 'spongebob' ? (
              <SpongeAvatar speaking={state.speaking} />
            ) : (
              <AvatarSVG {...avatarProps} />
            )}
          </div>

          <button 
            className="nav-arrow right" 
            onClick={() => {
              const types = ['human', 'cat', 'spongebob']
              const idx = types.indexOf(state.avatarType)
              const nextIdx = (idx + 1) % types.length
              dispatch({ type: 'SET_AVATAR_TYPE', payload: types[nextIdx] })
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          <div className="avatar-shadow" />
          <p className="avatar-label">{state.avatarType.toUpperCase()}</p>
          <p className="customizer-hint">Use arrows to switch characters</p>
        </div>

        {/* Customizer Panel */}
        <CustomizerPanel state={state} dispatch={dispatch} />

        {/* Done Button */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_CUSTOMIZE', payload: false })}
          className="done-btn"
        >
          ✓ Done
        </button>
      </div>

      <style>{`
        .customizer-view {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          gap: 60px;
          background: var(--bg-primary);
          background-image:
            radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.12) 0%, transparent 40%),
            radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.08) 0%, transparent 40%);
          overflow: auto;
        }

        .customizer-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 60px;
          width: 100%;
          max-width: 1200px;
        }

        .avatar-stage {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          height: 100%;
          min-height: 400px;
        }

        .avatar-shadow {
          position: absolute;
          bottom: 25%;
          width: 180px;
          height: 30px;
          background: radial-gradient(ellipse, rgba(0, 0, 0, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 0;
        }

        .customizer-hint {
          position: absolute;
          bottom: 12%;
          font-size: 13px;
          color: var(--text-muted);
          font-style: italic;
          margin: 0;
        }

        .avatar-label {
          position: absolute;
          bottom: 18%;
          font-size: 14px;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: 0.1em;
          margin: 0;
          text-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .nav-arrow:hover {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }

        .nav-arrow.left { left: 40px; }
        .nav-arrow.right { right: 40px; }

        .done-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          padding: 12px 28px;
          border-radius: var(--radius-md);
          background: var(--accent);
          color: white;
          border: none;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          box-shadow: var(--shadow-md);
          z-index: 100;
          transition: transform 0.1s ease;
        }

        .done-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  )
}

function ChatView({ state, dispatch, avatarProps, onSend, isLoading }) {
  return (
    <div className="chat-view">
      <div className="chat-container">
        {/* Avatar Header */}
        <div className="avatar-header">
          <div
            className="avatar-wrapper"
            onClick={() => dispatch({ type: 'TOGGLE_CUSTOMIZE', payload: true })}
          >
            {state.avatarType === 'cat' ? (
              <CatAvatar speaking={state.speaking} />
            ) : state.avatarType === 'spongebob' ? (
              <SpongeAvatar speaking={state.speaking} />
            ) : (
              <AvatarSVG {...avatarProps} />
            )}
            <div className="avatar-edit-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
          </div>
          <SpeechBubble text={state.bubble} isLoading={isLoading} />
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          <ChatHistory messages={state.messages} />
          <ChatInput onSend={onSend} isLoading={isLoading} />
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <p className="status-text" style={{ color: state.error ? '#ff4444' : 'var(--text-muted)' }}>
            {state.status}
          </p>
          <p className="version">Neura Sync v1.0</p>
        </div>
      </div>

      <style>{`
        .chat-view {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 24px;
          overflow: hidden;
        }

        .chat-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 16px;
        }

        .avatar-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .avatar-wrapper {
          position: relative;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .avatar-wrapper:hover {
          transform: scale(1.02);
        }

        .avatar-edit-badge {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: var(--shadow-md);
          border: 2px solid var(--bg-primary);
        }

        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-glass);
          backdrop-filter: blur(10px);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 8px;
        }

        .status-text {
          font-size: 11px;
          margin: 0;
          font-weight: 500;
        }

        .version {
          font-size: 11px;
          margin: 0;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}
