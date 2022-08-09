import React, { useEffect } from 'react'
export default function Game() {
  const speak = (name: string) => {
    const utterance = new SpeechSynthesisUtterance(name)
    const voice = speechSynthesis.getVoices().find((voice) => voice.name === 'Yelda')
    if (voice) utterance.voice = voice
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0
    speechSynthesis.speak(utterance)
  }

  const speechRecognizer = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'tr-TR'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.start()
    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript
      speak(speechResult)
    }
  }

  useEffect(() => {
    speechRecognizer()
  }, [])

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h1>...</h1>
    </div>
  )
}
