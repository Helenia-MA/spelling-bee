const VOWELS = 'aeiou'

export function generateLetters() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let letters;
    do {
        letters = Array.from({length: 5}, () =>
        alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
    } while (!letters.split('').some(c => VOWELS.includes(c)));
    return letters;
}