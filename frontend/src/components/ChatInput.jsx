import React, { useState } from 'react'

export default function ChatInput({ onSend, isLoading }) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    if (value.trim() === '' || isLoading) return
    onSend(value.trim())
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '16px 20px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <input
        type="text"
        placeholder="Message Ava..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        style={{
          flex: 1,
          padding: '12px 16px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          fontSize: 14,
          outline: 'none',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
      />
      <button
        onClick={handleSend}
        disabled={isLoading || value.trim() === ''}
        style={{
          padding: '0 24px',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          background: isLoading || value.trim() === '' ? 'var(--bg-tertiary)' : 'var(--accent)',
          color: 'white',
          fontSize: 14,
          fontWeight: 600,
          cursor: isLoading || value.trim() === '' ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: value.trim() !== '' ? 'var(--shadow-sm)' : 'none',
        }}
      >
        {isLoading ? '...' : 'Send'}
      </button>
    </div>
  )
}
