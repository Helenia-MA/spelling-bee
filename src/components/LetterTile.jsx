export default function letterTile({letter, isCenter, onClick}) {
    return (
        <div className={`letter-tile ${isCenter ? 'center': ''}`}
            onClick={() => onClick(letter)}
        >
            {letter.toUpperCase()}
        </div>
    )
}