import React from 'react'

const CHIBI_EXPRESSIONS = {
  neutral: {
    mouthPath: 'M52,95 Q60,98 68,95',
    cheekOpacity: 0,
    browAngle: 0,
    eyeScaleY: 1,
  },
  happy: {
    mouthPath: 'M48,92 Q60,105 72,92',
    cheekOpacity: 0.6,
    browAngle: -5,
    eyeScaleY: 0.9,
  },
  sad: {
    mouthPath: 'M50,98 Q60,92 70,98',
    cheekOpacity: 0,
    browAngle: 10,
    eyeScaleY: 0.95,
  },
  surprised: {
    mouthPath: 'M54,92 Q60,102 66,92 Q60,82 54,92',
    cheekOpacity: 0.3,
    browAngle: -15,
    eyeScaleY: 1.25,
  },
  thinking: {
    mouthPath: 'M52,96 Q60,94 68,96',
    cheekOpacity: 0,
    browAngle: 5,
    eyeScaleY: 0.85,
  },
}

function ChibiAvatar({ speaking, expr = 'neutral', blinking }) {
  const expression = CHIBI_EXPRESSIONS[expr] || CHIBI_EXPRESSIONS.neutral

  const openAmount = typeof speaking === 'number' ? speaking : speaking ? 0.5 : 0
  const isSpeaking = openAmount > 0.15
  const mouthOpenAmount = Math.max(0, (openAmount - 0.15) * 20)

  return (
    <div
      className={isSpeaking ? 'chibi-speaking' : ''}
      style={{
        width: '180px',
        height: '210px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'visible',
        background: 'transparent',
      }}
    >
      <style>{`
        @keyframes chibi-bounce {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.03) translateY(-2px); }
        }
        @keyframes chibi-talk {
          0% { transform: scale(1) translateY(0) rotate(0deg); }
          25% { transform: scale(1.02) translateY(-1px) rotate(-1deg); }
          50% { transform: scale(1) translateY(0) rotate(0deg); }
          75% { transform: scale(1.02) translateY(-1px) rotate(1deg); }
          100% { transform: scale(1) translateY(0) rotate(0deg); }
        }
        .chibi-speaking {
          animation: chibi-talk 0.25s infinite ease-in-out !important;
        }
      `}</style>
      <svg
        viewBox="0 0 120 140"
        width="100%"
        height="100%"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Skin gradient */}
          <radialGradient id="chibiSkin" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFDFC4" />
            <stop offset="100%" stopColor="#F5C6A5" />
          </radialGradient>
          {/* Hair gradient - bright pink */}
          <linearGradient id="chibiHair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF69B4" />
            <stop offset="100%" stopColor="#FF1493" />
          </linearGradient>
          {/* Eye iris gradient */}
          <radialGradient id="chibiEye" cx="40%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#4FC3F7" />
            <stop offset="70%" stopColor="#0288D1" />
            <stop offset="100%" stopColor="#01579B" />
          </radialGradient>
          {/* Cheek blush gradient */}
          <radialGradient id="chibiCheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFAB91" />
            <stop offset="100%" stopColor="#FF8A65" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="60" cy="135" rx="35" ry="6" fill="#000" opacity="0.15" />

        {/* Body - tiny round body */}
        <ellipse cx="60" cy="125" rx="22" ry="12" fill="#E91E63" />
        <ellipse cx="60" cy="115" rx="15" ry="8" fill="#C2185B" opacity="0.3" />

        {/* Neck */}
        <rect x="54" y="95" width="12" height="12" fill="#F5C6A5" />

        {/* Back hair - large rounded sides */}
        <ellipse cx="30" cy="55" rx="20" ry="35" fill="#FF1493" />
        <ellipse cx="90" cy="55" rx="20" ry="35" fill="#FF1493" />
        <ellipse cx="60" cy="25" rx="45" ry="25" fill="#FF1493" />

        {/* Head circle - nearly fills viewBox (70% of height) */}
        <circle cx="60" cy="55" r="48" fill="url(#chibiSkin)" />

        {/* Front hair - bangs */}
        <path
          d="M20,35 Q30,15 45,25 Q55,10 65,25 Q80,15 90,35 Q85,20 75,28 Q65,18 55,28 Q45,18 35,28 Q25,20 20,35"
          fill="url(#chibiHair)"
        />

        {/* Hair highlights */}
        <ellipse cx="45" cy="22" rx="8" ry="4" fill="#FF69B4" opacity="0.6" />
        <ellipse cx="70" cy="25" rx="6" ry="3" fill="#FF69B4" opacity="0.6" />

        {/* Cheek blushes - large pink circles */}
        <circle cx="25" cy="70" r="14" fill="url(#chibiCheek)" opacity={expression.cheekOpacity} />
        <circle cx="95" cy="70" r="14" fill="url(#chibiCheek)" opacity={expression.cheekOpacity} />

        {/* Eyes container */}
        <g transform={`translate(0, ${expression.browAngle < 0 ? -2 : 0})`}>
          {/* Left eye - huge round */}
          <g transform={`translate(35, 60) scale(1, ${expression.eyeScaleY})`}>
            {/* Eye white */}
            <circle cx="0" cy="0" r="14" fill="white" stroke="#333" strokeWidth="0.5" />
            {/* Iris - big */}
            <circle cx="0" cy="0" r="10" fill="url(#chibiEye)" />
            {/* Pupil */}
            <circle cx="0" cy="0" r="5" fill="#1A1A1A" />
            {/* 3 shine dots */}
            <circle cx="4" cy="-4" r="2.5" fill="white" opacity="0.95" />
            <circle cx="-2" cy="-2" r="1.5" fill="white" opacity="0.8" />
            <circle cx="2" cy="3" r="1" fill="white" opacity="0.7" />
          </g>

          {/* Right eye - huge round */}
          <g transform={`translate(85, 60) scale(1, ${expression.eyeScaleY})`}>
            {/* Eye white */}
            <circle cx="0" cy="0" r="14" fill="white" stroke="#333" strokeWidth="0.5" />
            {/* Iris - big */}
            <circle cx="0" cy="0" r="10" fill="url(#chibiEye)" />
            {/* Pupil */}
            <circle cx="0" cy="0" r="5" fill="#1A1A1A" />
            {/* 3 shine dots */}
            <circle cx="4" cy="-4" r="2.5" fill="white" opacity="0.95" />
            <circle cx="-2" cy="-2" r="1.5" fill="white" opacity="0.8" />
            <circle cx="2" cy="3" r="1" fill="white" opacity="0.7" />
          </g>

          {/* Blinking - cover eyes with skin color */}
          {blinking && (
            <>
              <ellipse cx="35" cy="60" rx="14" ry="2" fill="#F5C6A5" />
              <ellipse cx="85" cy="60" rx="14" ry="2" fill="#F5C6A5" />
              {/* Eyelash lines */}
              <path d="M25,58 Q35,55 45,58" fill="none" stroke="#333" strokeWidth="1" />
              <path d="M75,58 Q85,55 95,58" fill="none" stroke="#333" strokeWidth="1" />
            </>
          )}
        </g>

        {/* Thick curved eyebrows */}
        <g transform={`rotate(${expression.browAngle}, 35, 38)`}>
          <path d="M22,40 Q35,32 48,40" fill="none" stroke="#4A148C" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <g transform={`rotate(${-expression.browAngle}, 85, 38)`}>
          <path d="M72,40 Q85,32 98,40" fill="none" stroke="#4A148C" strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* Nose - tiny ellipse, higher up on face */}
        <ellipse cx="60" cy="75" rx="2.5" ry="1.5" fill="#E91E63" opacity="0.6" />

        {/* Mouth - now properly on the face */}
        <g transform={`translate(0, ${isSpeaking ? -1 : 0})`}>
          {isSpeaking ? (
            <>
              {/* Open mouth */}
              <ellipse
                cx="60"
                cy={96 + mouthOpenAmount * 0.2}
                rx={6 + mouthOpenAmount * 0.15}
                ry={4 + mouthOpenAmount * 0.3}
                fill="#E57373"
                stroke="#C62828"
                strokeWidth="0.5"
              />
              {/* Tongue */}
              {mouthOpenAmount > 3 && (
                <ellipse
                  cx="60"
                  cy={98 + mouthOpenAmount * 0.2}
                  rx="3"
                  ry="1.5"
                  fill="#FF8A80"
                />
              )}
            </>
          ) : (
            <path
              d={expression.mouthPath}
              fill="none"
              stroke="#4A148C"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
        </g>

        {/* Hair accessories - cute bow */}
        <g transform="translate(85, 20)">
          <ellipse cx="0" cy="0" rx="8" ry="5" fill="#E91E63" />
          <circle cx="-5" cy="0" r="5" fill="#F06292" />
          <circle cx="5" cy="0" r="5" fill="#F06292" />
          <circle cx="0" cy="0" r="2" fill="#880E4F" />
        </g>
      </svg>
    </div>
  )
}

export default React.memo(ChibiAvatar)
