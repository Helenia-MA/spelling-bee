import { useState } from 'react'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import EndScreen from './components/EndScreen'
import { generateLetters } from './utils/generateLetters'
import { findPossibleWords } from './utils/findWords'
import './index.css'

function generateRound() {
  let letters, words, attempts = 0
  do {
    letters = generateLetters()
    words = findPossibleWords(letters)
    attempts++
  } while (words.length < 3 && attempts < 60)

  return {
    letters,
    centerIdx: Math.floor(Math.random() * 5),
    words,
  }
}

export default function App() {
  const [screen, setScreen] = useState('start') // 'start' | 'game' | 'end'
  const [playerName, setPlayerName] = useState('')
  const [round, setRound] = useState(null)
  const [endStats, setEndStats] = useState(null)

  function handleStart(name) {
    setPlayerName(name)
    setRound(generateRound())
    setScreen('game')
  }

  function handleEnd(stats) {
    setEndStats(stats)
    setScreen('end')
  }

  function handleRestart() {
    setRound(generateRound())
    setScreen('game')
  }

  function handleExit() {
    setScreen('start')
  }

  return (
    <div className="app">
      {screen === 'start' && (
        <StartScreen onStart={handleStart} />
      )}
      {screen === 'game' && round && (
        <GameScreen
          key={round.letters}
          name={playerName}
          letters={round.letters}
          centerIdx={round.centerIdx}
          words={round.words}
          onEnd={handleEnd}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      )}
      {screen === 'end' && (
        <EndScreen
          name={playerName}
          earned={endStats.earned}
          totalPossible={endStats.totalPossible}
          found={endStats.found}
          allWords={endStats.allWords}
          onPlayAgain={handleRestart}
          onHome={handleExit}
        />
      )}
    </div>
  )
}
