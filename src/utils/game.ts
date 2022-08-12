/* eslint-disable prefer-promise-reject-errors */
type PromiseReturnType = {
  message: string
  success: boolean
}

export let history: string[] = []
export const lostGameChance = process.env.REACT_APP_DEFAULT_COMPUTER_LOST_GAME_CHANCE
  ? process.env.REACT_APP_DEFAULT_COMPUTER_LOST_GAME_CHANCE
  : 30
export const computerMaxResponseTime = process.env.REACT_APP_DEFAULT_COMPUTER_MAX_RESPONSE_TIME
  ? process.env.REACT_APP_DEFAULT_COMPUTER_MAX_RESPONSE_TIME
  : '5000'

export const userMaxResponseTime: number = process.env.REACT_APP_DEAFULT_USER_MAX_RESPONSE_TIME
  ? parseInt(process.env.REACT_APP_DEAFULT_USER_MAX_RESPONSE_TIME)
  : 5000
export const names = require('../names.json')
export let userKnownedNames: string[] = []
export let gameStatus = 'idle'
export let listening = false
export const lastWord = () => {
  return history[history.length - 1]
}

export const computerAnswer = async (): Promise<PromiseReturnType> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const possibleAnswers = names.filter(
        (name: string) => name.concat().at(0) === getLastWordLastLetter()
      )
      if (shouldComputerAnswers()) {
        const answer: string = possibleAnswers.filter((name: string) => !history.includes(name))[
          Math.floor(Math.random() * possibleAnswers.length)
        ]
        history.push(answer)
        resolve({ success: true, message: answer })
        speak(answer)
      } else {
        gameStatus = 'won'
        // Söylenmiş Kelime Söylemeli ve Bilememeli
        if (Math.random() < 0.5) {
          reject({
            success: false,
            message: 'Bilgisayar Söylenen ismi söyledi'
          })
        }
        reject({ success: false, message: 'Bilgisayar Cevap Bulamadı' })
      }
    }, computerRandomAnswerTimeout())
  })
}

export const userAnswer = async (): Promise<PromiseReturnType> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const answer = await SpeechRecognizer()
      const isCorrect = checkAnswerIsCorrect(answer)
      if (isCorrect.success) {
        resolve(isCorrect)
      }
      reject(isCorrect)
    } catch (error) {
      gameStatus = 'lost'
      reject({
        success: false,
        message: error
      })
    }
  })
}

export const start = () => {
  history = []
  userKnownedNames = []
  const ind = Math.floor(Math.random() * (names.length - 0 + 1)) + 0
  gameStatus = 'playing'
  const name = names[ind]
  history.push(name)
  speak(name)
  return name
}

const checkAnswerIsCorrect = (answer: string): PromiseReturnType => {
  if (history.some((name) => name === answer)) {
    gameStatus = 'lost'
    return { success: false, message: 'Söylenen ismi söylediniz' }
  } else if (!names.includes(answer)) {
    gameStatus = 'lost'
    return {
      success: false,
      message: `Söylenen isim bulunamadı: ${answer}`
    }
  } else if (answer.concat().at(0) !== getLastWordLastLetter()) {
    gameStatus = 'lost'
    return {
      success: false,
      message: `Söylediğiniz isim '${answer}' ${getLastWordLastLetter()} harfiyle başlamıyor`
    }
  } else {
    userKnownedNames.push(answer)
    history.push(answer)
    return {
      success: true,
      message: answer
    }
  }
}

const speak = async (name: string) => {
  return new Promise((resolve) => {
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

const SpeechRecognizer = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    listening = true
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
      listening = false
      resolve(speechResult.split(' ')[0].toLocaleLowerCase())
    }

    setTimeout(() => {
      recognition.stop()
      listening = false
      reject('Beklenen süre içinde cevap alınamadı')
    }, userMaxResponseTime)
  })
}

const shouldComputerAnswers = () => {
  return !(Math.random() * 100 < lostGameChance)
}

const computerRandomAnswerTimeout = () => {
  return Math.floor(Math.random() * (parseInt(computerMaxResponseTime) - 250 + 1)) + 250
}

const getLastWordLastLetter = () => {
  return history.at(-1)?.concat().at(-1)
}
