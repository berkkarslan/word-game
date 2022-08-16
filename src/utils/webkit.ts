/* eslint-disable prefer-promise-reject-errors */
export let isListen = false
const userMaxResponseTime: number = process.env.REACT_APP_DEAFULT_USER_MAX_RESPONSE_TIME
  ? parseInt(process.env.REACT_APP_DEAFULT_USER_MAX_RESPONSE_TIME)
  : 5000

export const speak = async (name: string) => {
  return new Promise((resolve, reject) => {
    if (window.speechSynthesis === undefined) resolve('done')

    const utterance = new SpeechSynthesisUtterance(name)
    const voice = speechSynthesis.getVoices().find((voice) => voice.name === 'Yelda')
    if (voice) utterance.voice = voice
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0
    speechSynthesis.speak(utterance)
    utterance.onend = () => {
      resolve('done')
    }
  })
}

export const SpeechRecognizer = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition === undefined) {
      reject('Speech Recognition is not supported')
    }
    isListen = true
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'tr-TR'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = true
    recognition.start()
    let speechResult = ''
    recognition.onresult = (event: any) => {
      speechResult = event.results[0][0].transcript
      recognition.stop()
      isListen = false
      resolve(speechResult.split(' ')[0].toLocaleLowerCase())
    }

    setTimeout(() => {
      recognition.stop()
      isListen = false
      reject('Beklenen süre içinde cevap alınamadı')
    }, userMaxResponseTime)
  })
}
