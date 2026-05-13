import React from 'react'
import spongeSvg from '../assets/spongebob-avatar.svg'

function SpongeAvatar({ speaking }) {
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
        @keyframes sponge-talk {
          0% { transform: scale(1) translateY(0); }
          25% { transform: scale(1.05) translateY(-4px) rotate(-2deg); }
          50% { transform: scale(1) translateY(0) rotate(0deg); }
          75% { transform: scale(1.05) translateY(-4px) rotate(2deg); }
          100% { transform: scale(1) translateY(0); }
        }
        .sponge-speaking {
          animation: sponge-talk 0.15s infinite ease-in-out;
        }
      `}</style>
      <img 
        src={spongeSvg} 
        alt="SpongeBob Avatar" 
        className={speaking ? 'sponge-speaking' : ''}
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

export default React.memo(SpongeAvatar)
