import { useState, useEffect, useRef } from 'react'
import LetterTile from './LetterTile'
import FoundWords from './FoundWords'
import { canFormWord } from '../utils/findWords'

export default function GameScreen({ name, letters, centerIdx, words, onEnd, onRestart, onExit }) {
    const [remaining, setRemaining] = useState(new Set(words))
    const [found, setFound] = useState([])
    const [points, setPoints] = useState(0)
    const [trials, setTrials] = useState(words.length + 5)
    const [guess, setGuess] = useState('')
    const [feedback, setFeedback] = useState({ msg: 'Click letters or type to guess', type: 'neutral' })
    const [hints, setHints] = useState(3)
    const [usedHints, setUsedHints] = useState([])
    const [timerSecs, setTimerSecs] = useState(300)
    const [penalty, setPenalty] = useState(0)
    const [confirm, setConfirm] = useState(null) // 'restart' | 'exit' | null

    const totalPossible = words.reduce((s, w) => s + w.length, 0)
    const earned = Math.max(0, points - Math.floor(penalty))

    const remainingRef = useRef(remaining)
    const foundRef = useRef(found)
    const trialsRef = useRef(trials)
    const usedHintsRef = useRef(usedHints)

    const [tileAnim, setTileAnim] = useState(null) // 'bounce' | 'shake' | null


    useEffect(() => { remainingRef.current = remaining }, [remaining])
    useEffect(() => { foundRef.current = found }, [found])
    useEffect(() => { trialsRef.current = trials }, [trials])
    useEffect(() => { usedHintsRef.current = usedHints }, [usedHints])

    // timer
    useEffect(() => {
        const interval = setInterval(() => {
        setTimerSecs(t => {
            if (t <= 1) { clearInterval(interval); handleEnd('timeout'); return 0; }
            return t - 1
        })
        setPenalty(p => {
            // deduct 0.5 pts every 2 minutes
            if (timerSecs > 0 && timerSecs % 120 === 0 && timerSecs < 300) return p + 0.5
            return p
        })
        }, 1000)
        return () => clearInterval(interval)
    }, [])


    function triggerTileAnim(type) {
        setTileAnim(type)
        setTimeout(() => setTileAnim(null), 500)
    }

    function handleEnd(reason, overrides = {}) {
        onEnd({ reason, earned: overrides.earned ?? earned, totalPossible, found: overrides.found ?? foundRef.current.length, allWords: words })
    }

    function showFeedback(msg, type) {
        setFeedback({ msg, type })
        setTimeout(() => setFeedback({ msg: 'Click letters or type to guess', type: 'neutral' }), 2000)
    }

    function addLetter(l) {
        if (guess.length < 8) setGuess(g => g + l)
    }

    function deleteLetter() {
        setGuess(g => g.slice(0, -1))
    }

    function clearGuess() {
        setGuess('')
    }

    function submitGuess() {
        const word = guess.toLowerCase()
        setGuess('')

        if (word.length < 2) { showFeedback('Too short!', 'bad'); return }

        if (!canFormWord(word, letters)) {
            triggerTileAnim('shake')
            showFeedback('Each tile can only be used once!', 'bad')
            const next = trialsRef.current - 1
            setTrials(next)
            if (next <= 0) handleEnd('no-trials')
            return
        }

        if (foundRef.current.includes(word)) { showFeedback('Already found!', 'bad'); return }

        if (remainingRef.current.has(word)) {
            triggerTileAnim('bounce')
            const pts = word.length
            const newPoints = points + pts
            const newFound = [...foundRef.current, word]
            const newEarned = Math.max(0, newPoints - Math.floor(penalty))

            setPoints(newPoints)
            setRemaining(r => { const next = new Set(r); next.delete(word); return next })
            setFound(newFound)
            triggerTileAnim('bounce')
            showFeedback(`+${pts} point${pts > 1 ? 's' : ''} — nice!`, 'good')

            if (remainingRef.current.size === 1) {
                onEnd({ reason: 'all-found', earned: newEarned, totalPossible, found: newFound.length, allWords: words })

            }
        } else {
            triggerTileAnim('shake')
            showFeedback('Not a valid word', 'bad')
            const next = trialsRef.current - 1
            setTrials(next)
            if (next <= 0) handleEnd('no-trials')
        }
    }

    function handleHint() {
        if (hints <= 0) return
        const available = words.filter(w => !foundRef.current.includes(w) && !usedHintsRef.current.includes(w))
        if (available.length === 0 || hints <= 0) {
            showFeedback('No hints left!', 'neutral');
            return
        }
        const word = available[Math.floor(Math.random() * available.length)]
        const hint = word.length <= 3
        ? `${word[0].toUpperCase()}__ (${word.length} letters)`
        : `${word[0].toUpperCase()}${'_'.repeat(word.length - 2)}${word[word.length - 1]} (${word.length} letters)`
        showFeedback(`💡 ${hint}`, 'hint')
        setUsedHints(h => [...h, word])
        setHints(h => h - 1)
    }

    // keyboard support
    useEffect(() => {
        function onKey(e) {
        if (confirm) { if (e.key === 'Escape') setConfirm(null); return }
        if (e.key === 'Enter') { submitGuess(); return }
        if (e.key === 'Backspace') { deleteLetter(); return }
        if (/^[a-zA-Z]$/.test(e.key)) addLetter(e.key.toLowerCase())
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [guess, confirm])

    const m = Math.floor(timerSecs / 60)
    const s = timerSecs % 60
    const timerStr = `${m}:${s.toString().padStart(2, '0')}`
    const total = found.length + remaining.size
    const progressPct = total === 0 ? 0 : (found.length / total) * 100

    return (
        <div className="game-screen">

        {/* confirm overlay */}
        {confirm && (
            <div className="confirm-overlay">
                <div className="confirm-box">
                    <p>{confirm === 'restart' ? 'Start a new round? Current progress will be lost.' : 'Exit to home screen?'}</p>
                    <div className="confirm-btns">
                        <button onClick={() => setConfirm(null)}>Cancel</button>
                        <button className="confirm-yes" onClick={() => { setConfirm(null); confirm === 'restart' ? onRestart() : onExit() }}>
                        Yes
                        </button>
                    </div>
                </div>
            </div>
      )}

        <div className="game-header">
            <div>
                <div className="game-title">Spelling B<span>ee</span></div>
                <div className="player-label">playing as {name}</div>
            </div>
            <div className="header-right">
                <div className={`timer ${timerSecs <= 30 ? 'warn' : ''}`}>{timerStr}</div>
                <div className="header-btns">
                    <button onClick={() => setConfirm('restart')}>↺ restart</button>
                    <button className="danger" onClick={() => setConfirm('exit')}>✕ exit</button>
                </div>
            </div>
        </div>

        <div className="stats-row">
            <div className="stat"><div className="stat-val">{earned}</div><div className="stat-label">points</div></div>
            <div className="stat"><div className="stat-val">{found.length}</div><div className="stat-label">found</div></div>
            <div className="stat"><div className="stat-val">{trials}</div><div className="stat-label">trials left</div></div>
        </div>

        <div className="progress-wrap">
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
            <div className="progress-label">{found.length} of {total} words found</div>
        </div>

        <div className="letters-row">
            {letters.split('').map((l, i) => (
            <LetterTile key={i} letter={l} isCenter={i === centerIdx} onClick={addLetter} anim={tileAnim} />
            ))}
        </div>
        <div className="tiles-note">each tile can only be used once!</div>

        <div className={`guess-display ${feedback.type === 'good' ? 'flash-good' : feedback.type === 'bad' ? 'flash-bad' : ''}`}>
            {guess ? guess.toUpperCase() : '_ _ _ _ _'}
        </div>

        <div className={`feedback ${feedback.type}`}>{feedback.msg}</div>

        <div className="btn-row">
            <button onClick={clearGuess}>Clear</button>
            <button onClick={deleteLetter}>⌫</button>
            <button className="btn-submit" onClick={submitGuess}>Submit ↵</button>
        </div>

        <div className="hint-row">
            <button className="hint-btn" onClick={handleHint} disabled={hints === 0}>💡 Hint</button>
            <span className="hint-label">{hints === 0 ? 'No hints left' : `${hints} hint${hints > 1 ? 's' : ''} remaining`}</span>
        </div>

        <FoundWords words={found} maxPoints={totalPossible} />
        </div>
    )
    }