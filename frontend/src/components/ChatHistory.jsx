import React, { useEffect, useRef } from 'react'

function ChatHistory({ messages }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div
      ref={scrollRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {messages.length === 0 ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontStyle: 'italic',
            fontSize: 14,
            color: 'var(--text-muted)',
            opacity: 0.7,
          }}
        >
          Start a conversation with Ava...
        </div>
      ) : (
        messages.map((message, index) => {
          const isUser = message.role === 'user'
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                width: '100%',
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '10px 16px',
                  borderRadius: isUser ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  background: isUser ? 'var(--accent)' : 'var(--bg-tertiary)',
                  color: isUser ? 'white' : 'var(--text-primary)',
                  fontSize: 14,
                  lineHeight: 1.4,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {message.content}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default React.memo(ChatHistory)
