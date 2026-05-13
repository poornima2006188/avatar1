import React, { useEffect } from 'react'

export default function SpeechBubble({ text, isLoading }) {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }
      .loading-dot {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: var(--text-muted);
        animation: bounce 1.4s infinite ease-in-out;
        margin: 0 2px;
      }
      .loading-dot:nth-child(1) {
        animation-delay: -0.32s;
      }
      .loading-dot:nth-child(2) {
        animation-delay: -0.16s;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div
      style={{
        minHeight: 44,
        padding: '12px 20px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '80%',
        boxShadow: 'var(--shadow-sm)',
        textAlign: 'center',
      }}
    >
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
        </div>
      ) : (
        <p
          style={{
            margin: 0,
            fontStyle: 'italic',
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
          }}
        >
          {text}
        </p>
      )}
    </div>
  )
}
