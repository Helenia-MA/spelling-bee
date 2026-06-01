export default function foundWords({words, maxPoints}) {
    return (
        <div className="found-section">
            <div className="found-header">
                <span className="found-title">found words</span>
                <span className="found-max">max{maxPoints} points</span>
            </div>
            <div className="found-words">
                {words.map((w, i) => (
                    <span className="found-word" key={i}>
                        {w} <span className="found-pts">+{w.length}</span>
                    </span>
                ))}
            </div>
        </div>
    )
}