import { start, history, computerAnswer, userAnswer, names } from '../src/utils/game'

describe('game', () => {
  it('should start correctly', () => {
    const firstName = start()
    expect(history.length).toBe(1)
    expect(typeof firstName).toBe('string')
    expect(history.includes(firstName)).toBe(true)
  })
})

describe('computer', () => {
  it('answers correctly', async () => {
    try {
      const answer = await computerAnswer()
      expect(answer.success).toBe(true)
    } catch (error) {
      console.log(error)

      expect(
        !!(error.message === 'Bilgisayar Cevap Bulamadı' || 'Bilgisayar Söylenen ismi söyledi')
      ).toBe(true)
      expect(error.success).toBe(false)
    }
  })
})

describe('user', () => {
  const lastWord = history.at(-1)?.concat()
  it('answers correctly', async () => {
    const answer = names.filter(
      (name) => name.concat().at(0) === lastWord?.at(-1) && !history.includes(name)
    )[0]
    try {
      await userAnswer()
      expect(history.includes(answer)).toBe(true)
    } catch (error) {
      expect(error.success).toBe(false)
    }
  })

  it('answers incorrectly', async () => {
    try {
      await userAnswer()
    } catch (error) {
      expect(error.message).toBe('Söylenen isim bulunamadı' || 'Söylenen ismi söylediniz')
    }
  })
})
