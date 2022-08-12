/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import * as game from '../utils/game'
const userMaxResponseTime: number = process.env.REACT_APP_DEAFULT_USER_MAX_RESPONSE_TIME
  ? parseInt(process.env.REACT_APP_DEAFULT_USER_MAX_RESPONSE_TIME)
  : 5000
const Game = () => {
  const [word, setWord] = useState('')
  const [message, setMessage] = useState('')
  const [time, setTime] = useState(userMaxResponseTime / 1000)

  const gameFunc = async () => {
    if (game.gameStatus === 'playing') {
      try {
        setTime(userMaxResponseTime / 1000)
        const response = await game.userAnswer()
        if (response.success) setWord(response.message)
        const computerAnswer = await game.computerAnswer()
        if (computerAnswer.success) {
          setWord(computerAnswer.message)
          gameFunc()
        }
      } catch (error: any) {
        if (error.message) {
          setMessage(error.message)
        }
      }
    }
  }

  const playAgain = () => {
    game.start()
    setWord('')
    setTime(userMaxResponseTime / 1000)
    setMessage('')
    if (game.gameStatus === 'playing') {
      setWord(game.lastWord())
      gameFunc()
    }
  }

  useEffect(() => {
    if (game.gameStatus === 'playing') {
      setWord(game.lastWord())
      gameFunc()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (game.listening && time >= 0) setTime((prevTime) => prevTime - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const GameResult = () => {
    return (
      <>
        {game.listening ? <div>Sizi dinliyorum...</div> : undefined}
        <div className="mt-5">
          {game.gameStatus === 'won' ? (
            <div className="text-success text-center">
              <p>{message}</p>
              Kazandınız! <br /> Skor: {game.userKnownedNames.length}
            </div>
          ) : undefined}
          {game.gameStatus === 'lost' ? (
            <div className="text-danger text-center">
              <p>{message}</p>
              Kaybettiniz! <br /> Skor: {game.userKnownedNames.length}
            </div>
          ) : undefined}
        </div>
        {game.gameStatus !== 'playing' ? (
          <button className="btn btn-primary mt-5" onClick={() => playAgain()}>
            Tekrar Oyna
          </button>
        ) : undefined}
      </>
    )
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h1>
        {word.substring(0, word.length - 1)}
        <span className="text-success">{word.concat().at(-1)}</span>
      </h1>
      {game.listening ? <div key={time}>{time}</div> : undefined}
      <GameResult />
    </div>
  )
}

export default Game
