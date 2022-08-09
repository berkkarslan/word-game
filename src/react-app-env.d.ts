/// <reference types="react-scripts" />

interface Window {
  SpeechRecognition: any // 👈️ turn off type checking
  webkitSpeechRecognition: any
}

interface Props {
  onStart: () => void
}
