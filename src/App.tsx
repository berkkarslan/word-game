import React, { useState } from 'react'
import Game from './components/Game'
import { Welcome } from './components/Welcome'

function App() {
  const [game, setGame] = useState(false)
  const startGame = () => {
    setGame(true)
  }

  return (
    <div className="container-fluid w-100 h-100 d-flex flex-column justify-content-center align-items-center">
      {game ? <Game /> : <Welcome onStart={startGame} />}
    </div>
  )
}

export default App
