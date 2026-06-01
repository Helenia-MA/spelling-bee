export default function letterTile({letter, isCenter, onClick, anim}) {
    return (
        <div
            className={`letter-tile ${isCenter ? 'center': ''} ${anim || ''}`}
            onClick={() => onClick(letter)}
        >
            {letter.toUpperCase()}
        </div>
    )
}