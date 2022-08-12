/// <reference types="react-scripts" />

interface Window {
  SpeechRecognition: any // 👈️ turn off type checking
  webkitSpeechRecognition: any
}

type gameStatusType = 'idle' | 'playing' | 'lost' | 'won'

interface PromiseReturnType {
  message: string
  success: boolean
}
