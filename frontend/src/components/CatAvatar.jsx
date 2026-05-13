<<<<<<< HEAD
import React, { useMemo } from 'react'

const CAT_EXPRESSIONS = {
  neutral: {
    eyeScaleY: 1,
    eyeScaleX: 1,
    browAngle: 0,
    mouthY: 0,
    earAngle: 0,
    cheekOpacity: 0,
  },
  happy: {
    eyeScaleY: 0.6,
    eyeScaleX: 1.1,
    browAngle: -8,
    mouthY: -3,
    earAngle: -5,
    cheekOpacity: 0.5,
  },
  sad: {
    eyeScaleY: 0.85,
    eyeScaleX: 1,
    browAngle: 12,
    mouthY: 4,
    earAngle: 8,
    cheekOpacity: 0,
  },
  surprised: {
    eyeScaleY: 1.3,
    eyeScaleX: 1.2,
    browAngle: -15,
    mouthY: -5,
    earAngle: -3,
    cheekOpacity: 0,
  },
  thinking: {
    eyeScaleY: 0.75,
    eyeScaleX: 1,
    browAngle: 5,
    mouthY: 2,
    earAngle: 3,
    cheekOpacity: 0,
  },
}

function CatAvatar({ speaking, expr = 'neutral' }) {
  const expression = CAT_EXPRESSIONS[expr] || CAT_EXPRESSIONS.neutral

  const openAmount = typeof speaking === 'number' ? speaking : speaking ? 0.5 : 0
  const isSpeaking = openAmount > 0.15

  const mouthOpenAmount = Math.max(0, (openAmount - 0.15) * 25)

  const svgContent = useMemo(() => {
    const jawDrop = isSpeaking ? mouthOpenAmount : 0
    const mouthWidth = isSpeaking ? 20 + mouthOpenAmount * 0.5 : 18

    return (
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Fur gradients */}
          <radialGradient id="furBase" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFA726" />
            <stop offset="50%" stopColor="#FF8F00" />
            <stop offset="100%" stopColor="#E65100" />
          </radialGradient>
          <radialGradient id="furLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE0B2" />
            <stop offset="100%" stopColor="#FFCC80" />
          </radialGradient>
          <linearGradient id="earInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFCCBC" />
            <stop offset="100%" stopColor="#FFAB91" />
          </linearGradient>
          <radialGradient id="eyeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#4A6741" />
            <stop offset="100%" stopColor="#2E4227" />
          </radialGradient>
          <radialGradient id="noseGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFAB91" />
            <stop offset="100%" stopColor="#FF8A65" />
          </radialGradient>

          {/* Soft shadow filter */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
          </filter>
        </defs>

        {/* Background circle */}
        <circle cx="100" cy="100" r="95" fill="#FFF8E7" />

        {/* Ears - Behind head */}
        <g transform={`rotate(${expression.earAngle}, 55, 35)`}>
          {/* Left ear */}
          <path
            d="M35,75 L25,15 Q40,5 70,25 Z"
            fill="url(#furBase)"
            stroke="#E65100"
            strokeWidth="1.5"
          />
          <path
            d="M38,65 L32,22 Q42,15 62,28 Z"
            fill="url(#earInner)"
          />
        </g>
        <g transform={`rotate(${-expression.earAngle}, 145, 35)`}>
          {/* Right ear */}
          <path
            d="M165,75 L175,15 Q160,5 130,25 Z"
            fill="url(#furBase)"
            stroke="#E65100"
            strokeWidth="1.5"
          />
          <path
            d="M162,65 L168,22 Q158,15 138,28 Z"
            fill="url(#earInner)"
          />
        </g>

        {/* Head base */}
        <ellipse cx="100" cy="105" rx="70" ry="62" fill="url(#furBase)" filter="url(#softShadow)" />

        {/* Forehead markings (subtle stripes) */}
        <path d="M100,55 L95,70 L100,65 L105,70 Z" fill="#E65100" opacity="0.4" />
        <path d="M85,58 L80,72 L85,68 Z" fill="#E65100" opacity="0.3" />
        <path d="M115,58 L120,72 L115,68 Z" fill="#E65100" opacity="0.3" />

        {/* Muzzle area - lighter fur */}
        <ellipse cx="100" cy="118" rx="38" ry="32" fill="url(#furLight)" />

        {/* Cheek fluff */}
        <ellipse cx="42" cy="108" rx="8" ry="12" fill="#FF8F00" opacity="0.8" />
        <ellipse cx="158" cy="108" rx="8" ry="12" fill="#FF8F00" opacity="0.8" />

        {/* Eyes container */}
        <g transform={`translate(0, ${expression.browAngle > 0 ? 2 : expression.browAngle < 0 ? -2 : 0})`}>
          {/* Left eye */}
          <g transform={`translate(70, 95) scale(${expression.eyeScaleX}, ${expression.eyeScaleY})`}>
            {/* Eye white (almond shape for cat) */}
            <path
              d="M-18,0 Q0,-22 18,0 Q0,18 -18,0"
              fill="#FFFBF0"
              stroke="#3E2723"
              strokeWidth="2"
            />
            {/* Iris */}
            <ellipse cx="0" cy="0" rx="12" ry={14 * expression.eyeScaleY} fill="url(#eyeGradient)" />
            {/* Pupil (vertical slit for cat) */}
            <ellipse cx="0" cy="0" rx={4} ry={10 * expression.eyeScaleY} fill="#1A1A1A" />
            {/* Eye shine */}
            <circle cx="5" cy={-4 * expression.eyeScaleY} r="3" fill="white" opacity="0.9" />
            <circle cx="-3" cy={3 * expression.eyeScaleY} r="1.5" fill="white" opacity="0.5" />
          </g>

          {/* Right eye */}
          <g transform={`translate(130, 95) scale(${expression.eyeScaleX}, ${expression.eyeScaleY})`}>
            <path
              d="M-18,0 Q0,-22 18,0 Q0,18 -18,0"
              fill="#FFFBF0"
              stroke="#3E2723"
              strokeWidth="2"
            />
            <ellipse cx="0" cy="0" rx="12" ry={14 * expression.eyeScaleY} fill="url(#eyeGradient)" />
            <ellipse cx="0" cy="0" rx={4} ry={10 * expression.eyeScaleY} fill="#1A1A1A" />
            <circle cx="5" cy={-4 * expression.eyeScaleY} r="3" fill="white" opacity="0.9" />
            <circle cx="-3" cy={3 * expression.eyeScaleY} r="1.5" fill="white" opacity="0.5" />
          </g>
        </g>

        {/* Eyebrows/Eye lines */}
        <path
          d={`M52,${78 + expression.browAngle} Q70,${72 + expression.browAngle * 0.5} 85,${80 + expression.browAngle}`}
          fill="none"
          stroke="#3E2723"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d={`M115,${80 + expression.browAngle} Q130,${72 + expression.browAngle * 0.5} 148,${78 + expression.browAngle}`}
          fill="none"
          stroke="#3E2723"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Nose */}
        <path
          d={`M92,${118 + expression.mouthY} L108,${118 + expression.mouthY} L100,${127 + expression.mouthY} Z`}
          fill="url(#noseGradient)"
          stroke="#E64A19"
          strokeWidth="1"
        />
        {/* Nose bridge line */}
        <line
          x1="100"
          y1={127 + expression.mouthY}
          x2="100"
          y2={132 + expression.mouthY}
          stroke="#E64A19"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Mouth area */}
        <g transform={`translate(0, ${expression.mouthY})`}>
          {isSpeaking ? (
            <>
              {/* Mouth open - cat's mouth opens downward revealing lower jaw */}
              <path
                d={`
                  M ${100 - mouthWidth * 0.6},${135 + jawDrop * 0.2}
                  Q ${100},${145 + jawDrop} ${100 + mouthWidth * 0.6},${135 + jawDrop * 0.2}
                  Q ${100},${155 + jawDrop} ${100 - mouthWidth * 0.6},${135 + jawDrop * 0.2}
                `}
                fill="#4A2323"
                stroke="#3E2723"
                strokeWidth="1"
              />
              {/* Tongue */}
              {jawDrop > 8 && (
                <ellipse
                  cx="100"
                  cy={145 + jawDrop * 0.6}
                  rx="8"
                  ry="4"
                  fill="#E57373"
                />
              )}
              {/* Upper lip line */}
              <path
                d={`M${100 - mouthWidth * 0.5},${132} Q100,${128} ${100 + mouthWidth * 0.5},${132}`}
                fill="none"
                stroke="#3E2723"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              {/* Closed mouth - cat's "W" shaped mouth */}
              <path
                d={`
                  M${100 - 12},${134}
                  Q${100 - 6},${138 + (expr === 'happy' ? 4 : expr === 'sad' ? -2 : 0)} ${100},${134}
                  Q${100 + 6},${138 + (expr === 'happy' ? 4 : expr === 'sad' ? -2 : 0)} ${100 + 12},${134}
                `}
                fill="none"
                stroke="#3E2723"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Small vertical line for cat mouth detail */}
              <line
                x1="100"
                y1="134"
                x2="100"
                y2={expr === 'happy' ? '138' : '136'}
                stroke="#3E2723"
                strokeWidth="2"
                opacity="0.8"
              />
            </>
          )}
        </g>

        {/* Whiskers - prominent cat feature */}
        <g stroke="#3E2723" strokeWidth="1" opacity="0.5" fill="none">
          {/* Left whiskers */}
          <path d={`M55,${118 + expression.mouthY} L25,${112 + expression.mouthY}`} />
          <path d={`M55,${124 + expression.mouthY} L22,${124 + expression.mouthY}`} />
          <path d={`M55,${130 + expression.mouthY} L25,${136 + expression.mouthY}`} />
          {/* Right whiskers */}
          <path d={`M145,${118 + expression.mouthY} L175,${112 + expression.mouthY}`} />
          <path d={`M145,${124 + expression.mouthY} L178,${124 + expression.mouthY}`} />
          <path d={`M145,${130 + expression.mouthY} L175,${136 + expression.mouthY}`} />
        </g>

        {/* Cheeks - pink tint when happy */}
        {expression.cheekOpacity > 0 && (
          <>
            <ellipse cx="55" cy="125" rx="12" ry="8" fill="#FFAB91" opacity={expression.cheekOpacity} />
            <ellipse cx="145" cy="125" rx="12" ry="8" fill="#FFAB91" opacity={expression.cheekOpacity} />
          </>
        )}

        {/* Subtle chin shadow */}
        <ellipse cx="100" cy="155" rx="30" ry="8" fill="#E65100" opacity="0.15" />
      </svg>
    )
  }, [expression, isSpeaking, mouthOpenAmount, expr])

  return (
    <div
      className={isSpeaking ? 'cat-speaking' : ''}
      style={{
        width: '180px',
        height: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '10px',
        transition: 'transform 0.1s ease-out',
      }}
    >
      <style>{`
        @keyframes cat-subtle-breathe {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.01) translateY(-1px); }
        }
        @keyframes cat-speaking-bounce {
          0% { transform: scale(1) translateY(0); }
          25% { transform: scale(1.015) translateY(-2px); }
          50% { transform: scale(1) translateY(0); }
          75% { transform: scale(1.015) translateY(-2px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes ear-twitch-left {
          0%, 90%, 100% { transform: rotate(0deg); }
          92% { transform: rotate(-4deg); }
          94% { transform: rotate(2deg); }
          96% { transform: rotate(-2deg); }
        }
        @keyframes ear-twitch-right {
          0%, 85%, 100% { transform: rotate(0deg); }
          87% { transform: rotate(4deg); }
          89% { transform: rotate(-2deg); }
          91% { transform: rotate(2deg); }
        }
        .cat-speaking {
          animation: cat-speaking-bounce 0.25s infinite ease-in-out !important;
        }
        .cat-speaking .ear-left {
          animation: ear-twitch-left 3s infinite ease-in-out;
        }
        .cat-speaking .ear-right {
          animation: ear-twitch-right 3s infinite ease-in-out;
        }
      `}</style>
      {svgContent}
=======
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
>>>>>>> origin/main
    </div>
  )
}

export default React.memo(CatAvatar)
