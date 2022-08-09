import React, { useEffect, useState } from 'react'

interface Props {
  onStart: () => void
}
export const Welcome: React.FC<Props> = ({ onStart }) => {
  const [mic, setMic] = useState(false)
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setMic(!stream.getAudioTracks()[0].muted)
      })
      .catch((err) => {
        setMic(false)
        console.log(err)
      })
  }, [])

  const startGame = () => {
    onStart()
  }

  return (
    <>
      <h1 className="mb-5"> Kelime Oyunu </h1>
      <button disabled={!mic} className="btn btn-primary" onClick={() => startGame()}>
        Başla
      </button>
      {!mic ? (
        <div className="text-danger mt-5">Lütfen mikrofon için erişim izini veriniz.</div>
      ) : undefined}
    </>
  )
}
