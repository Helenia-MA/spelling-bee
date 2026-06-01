export default function EndScreen({name, earned, totalPossible, found, allWords, onPlayAgain, onHome}) {
    return (
        <div className="end-screen">
            <h2>Round Over!</h2>
            <p>{name} found {found} word{found !== 1 ? 's': ''}</p>
            <div className="final-score">{earned}</div>
            <div className="final-label">out of {totalPossible} possible points</div>
            <div className="solution">
                <div className="solution-title"> all possible words</div>
                <div className="solution-words">
                    {allWords.sort((a, b) => b.length - a.length).map((w, i) => (
                        <span className="solution-word" key={i}>
                            {w} <span className="solution-pts">(+{w.length}) </span>
                        </span>
                    ))}
                    </div>
            </div>
            <div className="end-btns">
                <button onClick={onPlayAgain}>Play Again</button>
                <button onClick={onHome}>Home</button>
            </div>

        </div>
    )
}