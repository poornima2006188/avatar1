import { useEffect, useRef, useState, useCallback } from 'react'

// Viseme mouth shapes for lip sync
const VISME_SHAPES = [
  'rest',      // 0: Neutral/rest position
  'ee',        // 1: Smiley/long "ee" as in "see"
  'mid',       // 2: Slightly open
  'wide',      // 3: Wide open "ah" as in "father"
  'round',     // 4: Rounded "oh" as in "go"
  'sad',       // 5: Frown/sad
  'happy',     // 6: Big smile
  'surprised', // 7: Surprised "oh"
]

// Target open amounts for each syllable
const SYLLABLE_OPENS = [0.7, 1.0, 0.8, 0.5, 0.9, 0.6]

// Partial close amount (never fully shut between syllables)
const PARTIAL_CLOSE = 0.08

// Lerp speed for smooth transitions (adjust for responsiveness vs smoothness)
const LERP_FACTOR = 0.15

<<<<<<< HEAD
// Voice presets for different avatars
const VOICE_PRESETS = {
  human: {
    rate: 0.95,
    pitch: 0.85,
    voicePreference: /male|man|guy|david|mark|james|daniel|george|ryan/i,
  },
  cat: {
    rate: 1.15,        // Faster for cartoon energy
    pitch: 1.35,      // Higher pitch for cute cartoon cat
    voicePreference: /female|woman|girl|zira|aria|jenny/i, // Prefer lighter voices
  },
  spongebob: {
    rate: 1.25,       // Faster, energetic
    pitch: 1.55,      // Much higher pitched (SpongeBob's signature voice)
    voicePreference: /male|guy/i,
  },
}

export default function useSpeech(dispatch, avatarType = 'human') {
=======
export default function useSpeech(dispatch) {
>>>>>>> origin/main
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef(null)
  const pendingOnEndRef = useRef(null)

  // Viseme/animation state
  const animationRef = useRef(null)
  const openAmountRef = useRef(0)
  const targetOpenRef = useRef(0)
  const visemeIndexRef = useRef(0)
  const isSpeakingRef = useRef(false)
  const partialCloseTimeoutRef = useRef(null)

  // Animation loop - runs continuously to lerp openAmount
  const animate = useCallback(() => {
    const current = openAmountRef.current
    const target = targetOpenRef.current

    // Lerp toward target
    const newValue = current + (target - current) * LERP_FACTOR
    openAmountRef.current = newValue

    // Dispatch SET_SPEAKING when openAmount > 0.15
    const isVisiblyOpen = newValue > 0.15
    dispatch({
      type: 'SET_SPEAKING',
      payload: isVisiblyOpen ? newValue : 0,
    })

    // Continue animation loop
    animationRef.current = requestAnimationFrame(animate)
  }, [dispatch])

  // Start animation loop on mount
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (partialCloseTimeoutRef.current) {
        clearTimeout(partialCloseTimeoutRef.current)
      }
    }
  }, [animate])

  useEffect(() => {
    const synth = window.speechSynthesis
    if (!synth) {
      setIsSupported(false)
      return
    }

    setIsSupported(true)

    const loadVoices = () => {
      const allVoices = synth.getVoices()
      const englishVoices = allVoices.filter((voice) => voice.lang?.toLowerCase().startsWith('en'))
      setVoices(englishVoices)

      if (!selectedVoice && englishVoices.length > 0) {
        // Prefer a male voice
        const male = englishVoices.find((voice) =>
          /male|man|guy|david|mark|james|daniel|george|ryan/i.test(voice.name) ||
          /male|man/i.test(voice.voiceURI)
        )
        setSelectedVoice(male || englishVoices[0])
      }
    }

    loadVoices()
    synth.onvoiceschanged = loadVoices

    return () => {
      if (synth.onvoiceschanged === loadVoices) {
        synth.onvoiceschanged = null
      }
    }
  }, [selectedVoice])

  const stop = () => {
    const synth = window.speechSynthesis
    if (!synth) return

    synth.cancel()
    if (typeof pendingOnEndRef.current === 'function') {
      pendingOnEndRef.current()
      pendingOnEndRef.current = null
    }

    // Reset viseme state
    isSpeakingRef.current = false
    visemeIndexRef.current = 0
    targetOpenRef.current = 0

    if (partialCloseTimeoutRef.current) {
      clearTimeout(partialCloseTimeoutRef.current)
      partialCloseTimeoutRef.current = null
    }
  }

<<<<<<< HEAD
  const speak = (text, { onStart, onEnd, avatarType: speakAvatarType } = {}) => {
=======
  const speak = (text, { onStart, onEnd } = {}) => {
>>>>>>> origin/main
    const synth = window.speechSynthesis
    if (!synth) {
      return
    }

    stop()

<<<<<<< HEAD
    // Get voice preset based on avatar type
    const currentAvatarType = speakAvatarType || avatarType || 'human'
    const preset = VOICE_PRESETS[currentAvatarType] || VOICE_PRESETS.human

=======
>>>>>>> origin/main
    // Reset viseme state for new speech
    isSpeakingRef.current = true
    visemeIndexRef.current = 0
    openAmountRef.current = 0
    targetOpenRef.current = SYLLABLE_OPENS[0]

    const utterance = new SpeechSynthesisUtterance(text)
<<<<<<< HEAD
    utterance.rate = preset.rate
    utterance.pitch = preset.pitch
    utterance.volume = 1.0

    // Try to find a suitable voice for the avatar type
    if (voices.length > 0) {
      const preferredVoice = voices.find((voice) =>
        preset.voicePreference.test(voice.name)
      )
      utterance.voice = preferredVoice || selectedVoice || voices[0]
    } else if (selectedVoice) {
=======
    utterance.rate = 0.95
    utterance.pitch = 0.85
    utterance.volume = 1.0
    if (selectedVoice) {
>>>>>>> origin/main
      utterance.voice = selectedVoice
    }

    utterance.onstart = () => {
      if (typeof onStart === 'function') {
        onStart()
      }
    }

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Advance viseme index and cycle through shapes
        visemeIndexRef.current = (visemeIndexRef.current + 1) % SYLLABLE_OPENS.length
        const openValue = SYLLABLE_OPENS[visemeIndexRef.current]
        targetOpenRef.current = openValue

        // After 90ms, set target to partial close (never fully shut)
        if (partialCloseTimeoutRef.current) {
          clearTimeout(partialCloseTimeoutRef.current)
        }
        partialCloseTimeoutRef.current = setTimeout(() => {
          targetOpenRef.current = PARTIAL_CLOSE
        }, 90)
      }
    }

    utterance.onend = () => {
      isSpeakingRef.current = false
      visemeIndexRef.current = 0
      targetOpenRef.current = 0

      if (partialCloseTimeoutRef.current) {
        clearTimeout(partialCloseTimeoutRef.current)
        partialCloseTimeoutRef.current = null
      }

      if (typeof onEnd === 'function') {
        onEnd()
      }
      pendingOnEndRef.current = null
    }

    pendingOnEndRef.current = onEnd
    utteranceRef.current = utterance
    try {
      synth.speak(utterance)
    } catch (error) {
      console.warn('Speech synthesis error:', error)
      isSpeakingRef.current = false
      targetOpenRef.current = 0
      if (typeof onEnd === 'function') {
        onEnd()
      }
      pendingOnEndRef.current = null
    }
  }

<<<<<<< HEAD
  // Wrapper to speak with specific avatar type
  const speakWithAvatar = (text, options = {}, type) => {
    return speak(text, { ...options, avatarType: type })
  }

  return {
    speak,
    speakWithAvatar,
=======
  return {
    speak,
>>>>>>> origin/main
    stop,
    voices,
    selectedVoice,
    setVoice: setSelectedVoice,
    isSupported,
  }
}
