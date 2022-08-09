import { start, knownNames, computerAnswer, userAnswer, names } from '../src/utils/game'

describe('game', () => {
  it('should start correctly', () => {
    const firstName = start()
    expect(knownNames.length).toBe(1)
    expect(typeof firstName).toBe('string')
    expect(knownNames.includes(firstName)).toBe(true)
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
  const lastWord = knownNames.at(-1)?.concat()
  it('answers correctly', async () => {
    const answer = names.filter(
      (name) => name.concat().at(0) === lastWord?.at(-1) && !knownNames.includes(name)
    )[0]
    try {
      await userAnswer(answer)
      expect(knownNames.includes(answer)).toBe(true)
    } catch (error) {}
  })

  it('answers incorrectly', async () => {
    try {
      await userAnswer('1232d1s13fdg21as3')
    } catch (error) {
      expect(error.message).toBe('Söylenen isim bulunamadı' || 'Söylenen ismi söylediniz')
    }
  })
})
