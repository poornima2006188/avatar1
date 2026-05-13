const BANKS = {
  happy: [
    'great', 'glad', 'happy', 'love', 'wonderful', 'amazing', 'excellent',
    'good', 'absolutely', 'perfect', 'fantastic', 'enjoy', 'fun',
    'exciting', 'sure', 'yes', 'awesome', 'brilliant', 'delightful',
  ],
  sad: [
    'sorry', 'unfortunate', 'sad', 'regret', 'cannot', 'cant', 'wont',
    'unable', 'fail', 'difficult', 'hard', 'problem', 'issue',
    'error', 'bad', 'unfortunately', 'apolog', 'miss', 'hurt',
  ],
  surprised: [
    'wow', 'really', 'oh', 'seriously', 'incredible', 'unbelievable',
    'surprising', 'unexpected', 'whoa', 'shocking', 'no way', 'omg',
  ],
  thinking: [
    'think', 'consider', 'analyze', 'perhaps', 'maybe', 'let me',
    'wondering', 'complex', 'interesting', 'curious', 'ponder',
    'reflect', 'evaluate', 'assess', 'hmm', 'well',
  ],
}

const EMOJIS = {
  happy: '😊',
  sad: '😢',
  surprised: '😲',
  thinking: '🤔',
  neutral: '😐',
}

function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .replace(/[\p{P}$+<=>^`|~]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function detectSentiment(text) {
  const normalized = normalizeText(text)
  const scores = {
    happy: 0,
    sad: 0,
    surprised: 0,
    thinking: 0,
  }

  for (const sentiment of Object.keys(BANKS)) {
    for (const keyword of BANKS[sentiment]) {
      if (normalized.includes(keyword)) {
        scores[sentiment] += 1
      }
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1]
    const order = ['happy', 'surprised', 'thinking', 'sad']
    return order.indexOf(a[0]) - order.indexOf(b[0])
  })

  const [winner, score] = sorted[0]
  return score === 0 ? 'neutral' : winner
}

export function getSentimentEmoji(sentiment) {
  return EMOJIS[sentiment] ?? EMOJIS.neutral
}

export function getSentimentLabel(text) {
  const sentiment = detectSentiment(text)
  return `${sentiment} ${getSentimentEmoji(sentiment)}`
}
