import {
  start,
  history,
  computerAnswer,
  userAnswer,
  lastWord,
  checkAnswerIsCorrect,
  names
} from '../src/utils/game'

describe('game', () => {
  it('should start correctly', () => {
    const firstName = start()
    expect(history.length).toBe(1)
    expect(typeof firstName).toBe('string')
    expect(history.includes(firstName)).toBe(true)
  })

  it('should return last word correctly', () => {
    const response = lastWord()
    expect(typeof response).toBe('string')
    expect(history.includes(response)).toBe(true)
  })
})

describe('computer', () => {
  it('answers correctly', async () => {
    try {
      const original = process.env.REACT_APP_DEFAULT_COMPUTER_LOST_GAME_CHANCE
      process.env.REACT_APP_DEFAULT_COMPUTER_LOST_GAME_CHANCE = '0'
      const answer = await computerAnswer()
      expect(answer.success).toBe(true)
      process.env.MOCK_MODE = original
    } catch (error) {
      expect(
        !!(error.message === 'Bilgisayar Cevap Bulamadı' || 'Bilgisayar Söylenen ismi söyledi')
      ).toBe(true)
      expect(error.success).toBe(false)
    }
  })

  it('answers wrong', async () => {
    try {
      const original = process.env.REACT_APP_DEFAULT_COMPUTER_LOST_GAME_CHANCE
      process.env.REACT_APP_DEFAULT_COMPUTER_LOST_GAME_CHANCE = '99'
      const answer = await computerAnswer()
      expect(answer.success).toBe(true)
      process.env.MOCK_MODE = original
    } catch (error) {
      expect(
        !!(error.message === 'Bilgisayar Cevap Bulamadı' || 'Bilgisayar Söylenen ismi söyledi')
      ).toBe(true)
      expect(error.success).toBe(false)
    }
  })
})

describe('user', () => {
  it('answers incorrectly', async () => {
    try {
      await userAnswer()
    } catch (error) {
      return expect(error.message).toBe('Speech Recognition is not supported')
    }
  })

  it('answers correctly', () => {
    const lastLetter = lastWord().concat().at(-1)
    const possibleAnswers = names.filter(
      (name: string) => name.concat().at(0) === lastLetter && !history.includes(name)
    )
    const response = checkAnswerIsCorrect(possibleAnswers[0])
    expect(response.success).toBe(true)
  })

  it('fails when name sayed again', () => {
    const response = checkAnswerIsCorrect(history[0])
    expect(response.success).toBe(false)
  })

  it('fails when name not in list', () => {
    const response = checkAnswerIsCorrect('1ikl32klkl')
    expect(response.success).toBe(false)
  })

  it('fails when name not starting with last words last letter', () => {
    const lastLetter = lastWord().concat().at(-1)
    const possibleAnswers = names.filter(
      (name: string) => name.concat().at(0) !== lastLetter && !history.includes(name)
    )
    const response = checkAnswerIsCorrect(possibleAnswers[0])
    expect(response.success).toBe(false)
  })
})
