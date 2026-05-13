import React from 'react'
import catSvg from '../assets/cat-avatar.svg'

function CatAvatar({ speaking }) {
  // We can add some simple animations here later if needed
  return (
    <div style={{
      width: '180px',
      height: '180px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '24px',
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '10px'
    }}>
      <style>{`
        @keyframes cat-talk {
          0% { transform: scale(1) translateY(0); }
          25% { transform: scale(1.02) translateY(-2px) rotate(-1deg); }
          50% { transform: scale(1) translateY(0) rotate(0deg); }
          75% { transform: scale(1.02) translateY(-2px) rotate(1deg); }
          100% { transform: scale(1) translateY(0); }
        }
        .cat-speaking {
          animation: cat-talk 0.2s infinite ease-in-out;
        }
      `}</style>
      <img 
        src={catSvg} 
        alt="Cat Avatar" 
        className={speaking ? 'cat-speaking' : ''}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transition: 'transform 0.2s ease-out'
        }}
      />
    </div>
  )
}

export default React.memo(CatAvatar)
