import React from 'react'

const SKIN_TONES = [
  { c: '#FDDBB4', s: '#E8B87A' },
  { c: '#FAD4A6', s: '#F0B07A' },
  { c: '#F5BC8A', s: '#D9915A' },
  { c: '#E8975C', s: '#C47040' },
  { c: '#C4713A', s: '#9E5220' },
  { c: '#8B4513', s: '#6B3010' },
  { c: '#5C2E0A', s: '#3A1A05' },
]

const HAIR_COLORS = [
  '#1A0A00', '#3A2A1A', '#6B3A1A', '#A0522D', '#C8A060', '#D4A043',
  '#F5C060', '#E8D5B0', '#888888', '#CC2244', '#4455CC', '#22AAAA',
]

const EYE_COLORS = ['#2C1A0E', '#4A3520', '#6B8E23', '#4682B4', '#708090', '#1C1C1C', '#7B4F9E', '#2E8B57']
const LIP_COLORS = ['#C0704A', '#E07080', '#B03050', '#E8A0A0', '#CC3355', '#8B2040', '#D2691E', '#FF6B6B']
const HAIR_STYLES = ['short', 'long', 'curly', 'bun', 'spiky', 'bob', 'buzz']
const ACCESSORIES = ['none', 'glasses', 'cap', 'earrings']

const sectionLabel = {
  margin: 0,
  marginBottom: 8,
  fontSize: 11,
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  letterSpacing: '0.04em',
}

const swatchStyle = {
  width: 30,
  height: 30,
  borderRadius: '50%',
  margin: '0 8px 8px 0',
  cursor: 'pointer',
  border: '2px solid transparent',
  boxSizing: 'border-box',
}

const pillStyle = {
  padding: '8px 12px',
  margin: '0 8px 8px 0',
  borderRadius: 999,
  border: '1px solid var(--border)',
  background: 'var(--bg-secondary)',
  cursor: 'pointer',
  fontSize: 12,
}

const activePillStyle = {
  ...pillStyle,
  background: 'var(--bg-tertiary)',
  borderColor: 'var(--border-strong)',
}

export default function CustomizerPanel({ state, dispatch }) {
  const { skin, skinShade, hair, hairStyle, eye, lip, acc, availableVoices, selectedVoice } = state

  return (
    <aside style={{
      width: 380,
      height: 'calc(100vh - 80px)',
      padding: '24px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-lg)',
      overflowY: 'auto',
      position: 'relative',
      flexShrink: 0,
    }}>
      <h2 style={{ 
        margin: '0 0 24px 0', 
        fontSize: 18, 
        fontWeight: 700, 
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        Customize Avatar
      </h2>
      <div style={{ marginBottom: 24 }}>
        <p style={sectionLabel}>Skin tone</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {SKIN_TONES.map((tone, index) => {
            const active = tone.c === skin && tone.s === skinShade
            return (
              <button
                key={index}
                type="button"
                onClick={() => dispatch({ type: 'SET_SKIN', payload: { c: tone.c, s: tone.s } })}
                style={{
                  ...swatchStyle,
                  background: tone.c,
                  outline: active ? '2px solid var(--text-primary)' : '2px solid transparent',
                  outlineOffset: 2,
                }}
              />
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={sectionLabel}>Hair color</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {HAIR_COLORS.map((color) => {
            const active = color === hair
            return (
              <button
                key={color}
                type="button"
                onClick={() => dispatch({ type: 'SET_HAIR_COLOR', payload: color })}
                style={{
                  ...swatchStyle,
                  background: color,
                  outline: active ? '2px solid var(--text-primary)' : '2px solid transparent',
                  outlineOffset: 2,
                }}
              />
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={sectionLabel}>Hair style</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {HAIR_STYLES.map((style) => {
            const active = style === hairStyle
            return (
              <button
                key={style}
                type="button"
                onClick={() => dispatch({ type: 'SET_HAIR_STYLE', payload: style })}
                style={active ? activePillStyle : pillStyle}
              >
                {style}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={sectionLabel}>Eye color</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {EYE_COLORS.map((color) => {
            const active = color === eye
            return (
              <button
                key={color}
                type="button"
                onClick={() => dispatch({ type: 'SET_EYE', payload: color })}
                style={{
                  ...swatchStyle,
                  background: color,
                  outline: active ? '2px solid var(--text-primary)' : '2px solid transparent',
                  outlineOffset: 2,
                }}
              />
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={sectionLabel}>Lip color</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {LIP_COLORS.map((color) => {
            const active = color === lip
            return (
              <button
                key={color}
                type="button"
                onClick={() => dispatch({ type: 'SET_LIP', payload: color })}
                style={{
                  ...swatchStyle,
                  background: color,
                  outline: active ? '2px solid var(--text-primary)' : '2px solid transparent',
                  outlineOffset: 2,
                }}
              />
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={sectionLabel}>Accessories</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {ACCESSORIES.map((option) => {
            const active = option === acc
            return (
              <button
                key={option}
                type="button"
                onClick={() => dispatch({ type: 'SET_ACC', payload: option })}
                style={active ? activePillStyle : pillStyle}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={sectionLabel}>Voice</p>
        <select
          value={selectedVoice?.voiceURI || ''}
          onChange={(event) => {
            const selected = availableVoices.find((voice) => voice.voiceURI === event.target.value)
            dispatch({ type: 'SET_VOICE', payload: selected })
          }}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: 13,
            outline: 'none',
          }}
        >
          <option value="">Select voice</option>
          {availableVoices.map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={sectionLabel}>Theme</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['light', 'dark'].map((t) => (
            <button
              key={t}
              onClick={() => dispatch({ type: 'SET_THEME', payload: t })}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: state.theme === t ? 'var(--accent)' : 'var(--bg-secondary)',
                color: state.theme === t ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: 12,
                textTransform: 'capitalize',
                transition: 'all 0.2s ease',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
