import { useState} from 'react'

export default function StartScreen({ onStart}) {
    const [name, setName] = useState('')

    function handleStart() {
        onStart(name.trim() || 'Player')
    }

    return (
        <div className="start-screen">
            <div className="bee-emoji">🐝</div>
            <h1>Spelling B<span>ee</span></h1>
            <p>Form as many words as possible from the 5 letters given.<br />
               Longer words earn more points. You get 3 hints for each round!</p>
            <div className="name-row">
                <input
                    type="text"
                    placeholder="Your name..."
                    maxLength={20}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleStart()}
                />
                <button onClick={handleStart}>Play</button>
            </div>
        </div>
    )
}