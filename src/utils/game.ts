/* eslint-disable prefer-promise-reject-errors */
type PromiseReturnType = {
  message: string
  score: number
  success: boolean
}

export const lostGameChance: Number = process.env.REACT_APP_DEFAULT_COMPUTER_LOST_GAME_CHANCE
  ? Number(process.env.REACT_APP_DEFAULT_COMPUTER_LOST_GAME_CHANCE)
  : 0.3
export const computerMaxResponseTime = process.env.REACT_APP_DEFAULT_COMPUTER_MAX_RESPONSE_TIME
  ? process.env.REACT_APP_DEFAULT_COMPUTER_MAX_RESPONSE_TIME
  : 5000
export const names = require('../../names.json')
export let knownNames: string[] = []

export const computerAnswer = (): Promise<PromiseReturnType> => {
  return new Promise((resolve, reject) => {
    const answers = names.filter(
      (name: string) => name.concat().at(0) === knownNames.at(-1)?.concat().at(0)
    )
    if (shouldComputerAnswers()) {
      const answer: string = answers[0]
      knownNames.push(answer)
      resolve({ success: true, message: answer, score: knownNames.length })
    } else {
      // Söylenmiş Kelime Söylemeli ve Bilememeli
      if (Math.random() < 0.5) {
        reject({
          success: false,
          message: 'Bilgisayar Söylenen ismi söyledi',
          score: knownNames.length
        })
      }
      reject({ success: false, message: 'Bilgisayar Cevap Bulamadı', score: knownNames.length })
    }
  })
}

export const userAnswer = (answer: string) => {
  return new Promise((resolve, reject) => {
    if (knownNames.some((name) => name === answer)) {
      reject({ message: 'Söylenen ismi söylediniz', score: knownNames.length })
    } else if (names.includes(answer)) {
      knownNames.push(answer)
      resolve('')
    }
    reject({ success: false, message: 'Söylenen isim bulunamadı', score: knownNames.length })
  })
}

export const start = () => {
  knownNames = []
  const ind = Math.floor(Math.random() * (names.length - 0 + 1)) + 0
  const name = names[ind]
  knownNames.push(name)
  return name
}

const shouldComputerAnswers = () => {
  return Math.random() < lostGameChance
}
