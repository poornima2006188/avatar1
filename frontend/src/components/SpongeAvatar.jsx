import React from 'react'

const SPONGE_EXPRESSIONS = {
  neutral: {
    eyeScaleY: 1,
    eyeScaleX: 1,
    browAngle: 0,
    mouthY: 0,
    cheekY: 0,
  },
  happy: {
    eyeScaleY: 0.65,
    eyeScaleX: 1.05,
    browAngle: -10,
    mouthY: -5,
    cheekY: -3,
  },
  sad: {
    eyeScaleY: 0.9,
    eyeScaleX: 1,
    browAngle: 15,
    mouthY: 8,
    cheekY: 5,
  },
  surprised: {
    eyeScaleY: 1.4,
    eyeScaleX: 1.15,
    browAngle: -20,
    mouthY: -8,
    cheekY: -5,
  },
  thinking: {
    eyeScaleY: 0.75,
    eyeScaleX: 1,
    browAngle: 8,
    mouthY: 3,
    cheekY: 0,
  },
}

function SpongeAvatar({ speaking, expr = 'neutral' }) {
  const expression = SPONGE_EXPRESSIONS[expr] || SPONGE_EXPRESSIONS.neutral

  const openAmount = typeof speaking === 'number' ? speaking : speaking ? 0.5 : 0
  const isSpeaking = openAmount > 0.15

  const mouthOpenAmount = Math.max(0, (openAmount - 0.15) * 30)
  const jawDrop = isSpeaking ? mouthOpenAmount : 0

  // Arm animation based on speaking
  const leftArmAngle = isSpeaking ? -15 : 0
  const rightArmAngle = isSpeaking ? 15 : 0

  return (
    <div
      className={isSpeaking ? 'sponge-speaking' : ''}
      style={{
        width: '200px',
        height: '280px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'visible',
        background: 'transparent',
      }}
    >
      <style>{`
        @keyframes sponge-talk {
          0% { transform: scale(1) translateY(0); }
          25% { transform: scale(1.02) translateY(-2px); }
          50% { transform: scale(1) translateY(0); }
          75% { transform: scale(1.02) translateY(-2px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes left-arm-wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-20deg); }
          75% { transform: rotate(10deg); }
        }
        @keyframes right-arm-wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }
        .sponge-speaking {
          animation: sponge-talk 0.2s infinite ease-in-out !important;
        }
      `}</style>
      <svg
        viewBox="0 0 240 280"
        width="100%"
        height="100%"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="spongeBase" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="50%" stopColor="#FDD835" />
            <stop offset="100%" stopColor="#F9A825" />
          </radialGradient>
          <radialGradient id="spongeSide" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBC02D" />
            <stop offset="100%" stopColor="#F57F17" />
          </radialGradient>
          <radialGradient id="holeGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#B7950B" />
            <stop offset="100%" stopColor="#8D6E63" />
          </radialGradient>
          <linearGradient id="pantsBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5C6BC0" />
            <stop offset="100%" stopColor="#3949AB" />
          </linearGradient>
          <radialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFAB91" />
            <stop offset="100%" stopColor="#FF8A65" />
          </radialGradient>
        </defs>

        {/* Left Leg */}
        <g>
          <rect x="75" y="200" width="10" height="50" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
          <rect x="74" y="225" width="12" height="25" rx="2" fill="white" stroke="#BDBDBD" strokeWidth="1"/>
          <line x1="74" y1="230" x2="86" y2="230" stroke="#E53935" strokeWidth="2"/>
          <line x1="74" y1="235" x2="86" y2="235" stroke="#1E88E5" strokeWidth="2"/>
          <line x1="74" y1="240" x2="86" y2="240" stroke="#E53935" strokeWidth="2"/>
          <path d="M68,245 L92,245 L94,265 Q94,275 80,275 Q66,275 66,265 Z" fill="#212121"/>
        </g>

        {/* Right Leg */}
        <g>
          <rect x="155" y="200" width="10" height="50" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
          <rect x="154" y="225" width="12" height="25" rx="2" fill="white" stroke="#BDBDBD" strokeWidth="1"/>
          <line x1="154" y1="230" x2="166" y2="230" stroke="#E53935" strokeWidth="2"/>
          <line x1="154" y1="235" x2="166" y2="235" stroke="#1E88E5" strokeWidth="2"/>
          <line x1="154" y1="240" x2="166" y2="240" stroke="#E53935" strokeWidth="2"/>
          <path d="M148,245 L172,245 L174,265 Q174,275 160,275 Q146,275 146,265 Z" fill="#212121"/>
        </g>

        {/* Left Arm (behind body at shoulder, in front at hand) */}
        <g transform={`rotate(${leftArmAngle}, 45, 110)`}>
          <rect x="25" y="100" width="25" height="15" rx="3" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
          <rect x="25" y="100" width="25" height="18" rx="2" fill="white" stroke="#BDBDBD" strokeWidth="1"/>
          <rect x="15" y="112" width="12" height="45" rx="2" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
          <g transform="translate(10, 155)">
            <ellipse cx="11" cy="5" rx="12" ry="8" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
            <rect x="2" y="8" width="4" height="10" rx="2" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
            <rect x="7" y="10" width="4" height="10" rx="2" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
            <rect x="12" y="10" width="4" height="10" rx="2" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
            <rect x="17" y="8" width="4" height="10" rx="2" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
          </g>
        </g>

        {/* Right Arm */}
        <g transform={`rotate(${rightArmAngle}, 195, 110)`}>
          <rect x="190" y="100" width="25" height="15" rx="3" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
          <rect x="190" y="100" width="25" height="18" rx="2" fill="white" stroke="#BDBDBD" strokeWidth="1"/>
          <rect x="213" y="112" width="12" height="45" rx="2" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
          <g transform="translate(213, 155)">
            <ellipse cx="6" cy="5" rx="12" ry="8" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
            <rect x="-3" y="8" width="4" height="10" rx="2" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
            <rect x="2" y="10" width="4" height="10" rx="2" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
            <rect x="7" y="10" width="4" height="10" rx="2" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
            <rect x="12" y="8" width="4" height="10" rx="2" fill="#FDD835" stroke="#F57F17" strokeWidth="1"/>
          </g>
        </g>

        {/* Sponge body - main */}
        <rect x="45" y="35" width="140" height="165" rx="3" fill="url(#spongeBase)" stroke="#F57F17" strokeWidth="2"/>

        {/* Side of sponge (3D depth) */}
        <rect x="185" y="45" width="12" height="145" fill="url(#spongeSide)" stroke="#F57F17" strokeWidth="1"/>

        {/* Extra side rectangles - SpongeBob's wavy sides */}
        <rect x="35" y="45" width="12" height="25" rx="2" fill="url(#spongeBase)" stroke="#F57F17" strokeWidth="1"/>
        <rect x="35" y="75" width="12" height="20" rx="2" fill="url(#spongeBase)" stroke="#F57F17" strokeWidth="1"/>
        <rect x="35" y="100" width="12" height="30" rx="2" fill="url(#spongeBase)" stroke="#F57F17" strokeWidth="1"/>
        <rect x="35" y="135" width="12" height="22" rx="2" fill="url(#spongeBase)" stroke="#F57F17" strokeWidth="1"/>
        <rect x="35" y="162" width="12" height="28" rx="2" fill="url(#spongeBase)" stroke="#F57F17" strokeWidth="1"/>

        <rect x="200" y="50" width="10" height="22" rx="2" fill="url(#spongeSide)" stroke="#F57F17" strokeWidth="1"/>
        <rect x="200" y="78" width="10" height="25" rx="2" fill="url(#spongeSide)" stroke="#F57F17" strokeWidth="1"/>
        <rect x="200" y="108" width="10" height="20" rx="2" fill="url(#spongeSide)" stroke="#F57F17" strokeWidth="1"/>
        <rect x="200" y="133" width="10" height="28" rx="2" fill="url(#spongeSide)" stroke="#F57F17" strokeWidth="1"/>
        <rect x="200" y="165" width="10" height="22" rx="2" fill="url(#spongeSide)" stroke="#F57F17" strokeWidth="1"/>

        {/* Bottom edge */}
        <rect x="55" y="190" width="130" height="12" fill="#F9A825" stroke="#F57F17" strokeWidth="1"/>

        {/* Pores */}
        <g fill="url(#holeGrad)" opacity="0.7">
          <ellipse cx="65" cy="55" rx="10" ry="8" />
          <ellipse cx="165" cy="60" rx="12" ry="10" />
          <ellipse cx="75" cy="90" rx="7" ry="6" />
          <ellipse cx="155" cy="100" rx="9" ry="7" />
          <ellipse cx="60" cy="125" rx="6" ry="5" />
          <ellipse cx="170" cy="130" rx="8" ry="6" />
          <ellipse cx="90" cy="50" rx="6" ry="5" />
          <ellipse cx="145" cy="85" rx="7" ry="6" />
          <ellipse cx="70" cy="155" rx="7" ry="5" />
          <ellipse cx="160" cy="165" rx="6" ry="4" />
          <ellipse cx="115" cy="175" rx="8" ry="6" />
        </g>

        {/* Shirt */}
        <rect x="45" y="165" width="140" height="35" fill="white" stroke="#BDBDBD" strokeWidth="1"/>

        {/* Tie */}
        <path d="M108,165 L132,165 L128,195 L120,200 L112,195 Z" fill="#FF5722" stroke="#D84315" strokeWidth="1"/>
        <ellipse cx="120" cy="202" rx="10" ry="6" fill="#FF5722" stroke="#D84315" strokeWidth="1"/>

        {/* Pants line */}
        <rect x="45" y="198" width="140" height="6" fill="#5D4037"/>

        {/* Blue pants */}
        <rect x="45" y="204" width="140" height="32" fill="url(#pantsBlue)" stroke="#283593" strokeWidth="1"/>

        {/* Belt */}
        <rect x="55" y="201" width="18" height="6" rx="1" fill="#212121"/>
        <circle cx="64" cy="204" r="1.5" fill="#5D4037"/>
        <rect x="85" y="201" width="18" height="6" rx="1" fill="#212121"/>
        <circle cx="94" cy="204" r="1.5" fill="#5D4037"/>
        <rect x="120" y="201" width="18" height="6" rx="1" fill="#212121"/>
        <circle cx="129" cy="204" r="1.5" fill="#5D4037"/>
        <rect x="150" y="201" width="18" height="6" rx="1" fill="#212121"/>
        <circle cx="159" cy="204" r="1.5" fill="#5D4037"/>

        {/* Belt buckle */}
        <rect x="100" y="199" width="20" height="10" rx="2" fill="#FFD54F" stroke="#FF8F00" strokeWidth="2"/>
        <line x1="105" y1="202" x2="115" y2="206" stroke="#FF8F00" strokeWidth="2"/>
        <line x1="115" y1="202" x2="105" y2="206" stroke="#FF8F00" strokeWidth="2"/>

        {/* Eyes */}
        <g transform={`translate(0, ${expression.browAngle > 0 ? 3 : expression.browAngle < 0 ? -3 : 0})`}>
          {/* Left eye */}
          <g transform={`translate(95, 90) scale(${expression.eyeScaleX}, ${expression.eyeScaleY})`}>
            <circle cx="0" cy="0" r="28" fill="white" stroke="#37474F" strokeWidth="3"/>
            <circle cx="0" cy="0" r="11" fill="#42A5F5" stroke="#1976D2" strokeWidth="1"/>
            <circle cx="0" cy="0" r="6" fill="black"/>
            <circle cx="4" cy="-4" r="3" fill="white"/>
            <circle cx="-2" cy="2" r="1.5" fill="white" opacity="0.7"/>
          </g>

          {/* Right eye */}
          <g transform={`translate(135, 90) scale(${expression.eyeScaleX}, ${expression.eyeScaleY})`}>
            <circle cx="0" cy="0" r="28" fill="white" stroke="#37474F" strokeWidth="3"/>
            <circle cx="0" cy="0" r="11" fill="#42A5F5" stroke="#1976D2" strokeWidth="1"/>
            <circle cx="0" cy="0" r="6" fill="black"/>
            <circle cx="4" cy="-4" r="3" fill="white"/>
            <circle cx="-2" cy="2" r="1.5" fill="white" opacity="0.7"/>
          </g>

          {/* Eyelashes */}
          <g stroke="black" strokeWidth="2.5" strokeLinecap="round">
            <line x1="95" y1={62 - (1-expression.eyeScaleY) * 25} x2="95" y2={52 - (1-expression.eyeScaleY) * 25} />
            <line x1="78" y1={67 - (1-expression.eyeScaleY) * 25} x2="70" y2={58 - (1-expression.eyeScaleY) * 25} />
            <line x1="112" y1={67 - (1-expression.eyeScaleY) * 25} x2="120" y2={58 - (1-expression.eyeScaleY) * 25} />
            <line x1="135" y1={62 - (1-expression.eyeScaleY) * 25} x2="135" y2={52 - (1-expression.eyeScaleY) * 25} />
            <line x1="118" y1={67 - (1-expression.eyeScaleY) * 25} x2="110" y2={58 - (1-expression.eyeScaleY) * 25} />
            <line x1="152" y1={67 - (1-expression.eyeScaleY) * 25} x2="160" y2={58 - (1-expression.eyeScaleY) * 25} />
          </g>
        </g>

        {/* Eyebrows */}
        <g transform={`rotate(${expression.browAngle}, 95, 60)`}>
          <path d="M75,60 Q95,54 115,62" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"/>
        </g>
        <g transform={`rotate(${-expression.browAngle}, 135, 60)`}>
          <path d="M115,62 Q135,54 155,60" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"/>
        </g>

        {/* Nose */}
        <path
          d={`M115,${98 + expression.cheekY} Q120,${85 + expression.cheekY} 125,${98 + expression.cheekY} Q122,${110 + expression.cheekY} 120,${108 + expression.cheekY} Q118,${110 + expression.cheekY} 115,${98 + expression.cheekY}`}
          fill="#FDD835"
          stroke="#F57F17"
          strokeWidth="2"
        />

        {/* Cheeks */}
        <ellipse cx="70" cy={105 + expression.cheekY} rx="14" ry="9" fill="url(#cheekGrad)" opacity={expr === 'happy' ? 0.8 : 0.5} />
        <ellipse cx="160" cy={105 + expression.cheekY} rx="14" ry="9" fill="url(#cheekGrad)" opacity={expr === 'happy' ? 0.8 : 0.5} />

        {/* Freckles */}
        <g fill="#D84315" opacity="0.6">
          <circle cx="64" cy={102 + expression.cheekY} r="2"/>
          <circle cx="58" cy={108 + expression.cheekY} r="1.8"/>
          <circle cx="68" cy={110 + expression.cheekY} r="1.8"/>
          <circle cx="166" cy={102 + expression.cheekY} r="2"/>
          <circle cx="172" cy={108 + expression.cheekY} r="1.8"/>
          <circle cx="162" cy={110 + expression.cheekY} r="1.8"/>
        </g>

        {/* Mouth */}
        <g transform={`translate(0, ${expression.mouthY})`}>
          {isSpeaking ? (
            <>
              <ellipse
                cx="120"
                cy={125 + jawDrop * 0.5}
                rx={26 + jawDrop * 0.3}
                ry={14 + jawDrop * 0.6}
                fill="#3E2723"
                stroke="#5D4037"
                strokeWidth="1"
              />
              {jawDrop > 5 && (
                <>
                  <rect x="111" y={117 - jawDrop * 0.1} width="8" height={14 + jawDrop * 0.3} rx="1" fill="white" stroke="#E0E0E0" strokeWidth="0.5"/>
                  <rect x="123" y={117 - jawDrop * 0.1} width="8" height={14 + jawDrop * 0.3} rx="1" fill="white" stroke="#E0E0E0" strokeWidth="0.5"/>
                </>
              )}
              {jawDrop > 10 && (
                <ellipse cx="120" cy={130 + jawDrop * 0.5} rx="12" ry="5" fill="#E57373"/>
              )}
              <path d={`M95,${115} Q120,${110 - jawDrop * 0.2} 145,${115}`} fill="none" stroke="#3E2723" strokeWidth="3" strokeLinecap="round"/>
            </>
          ) : (
            <>
              {expr === 'happy' ? (
                <path d="M90,120 Q120,150 150,120" fill="none" stroke="#3E2723" strokeWidth="4" strokeLinecap="round"/>
              ) : expr === 'sad' ? (
                <path d="M95,130 Q120,120 145,130" fill="none" stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round"/>
              ) : expr === 'surprised' ? (
                <ellipse cx="120" cy="125" rx="14" ry="18" fill="#3E2723" stroke="#5D4037" strokeWidth="1"/>
              ) : (
                <path d="M95,123 Q120,133 145,123" fill="none" stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round"/>
              )}
            </>
          )}
        </g>

        {/* Chin */}
        <path d={`M115,${150 + expression.mouthY} Q120,${153 + expression.mouthY} 125,${150 + expression.mouthY}`} fill="none" stroke="#F57F17" strokeWidth="2" opacity="0.5"/>
      </svg>
    </div>
  )
}

export default React.memo(SpongeAvatar)
