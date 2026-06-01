import WORDS from './wordList.js';

export function canFormWord(word, letters) {
    const available = {};
    for (const c of letters) available[c] = (available[c] || 0) + 1;
    for (const c of word) {
        if (!available[c]) return false;
        available[c]--;
    }
    return true;
}

export function findPossibleWords(letters) {
    const valid = []
    for (const word of WORDS) {
        if (word.length >= 2 && canFormWord(word, letters)) {
            valid.push(word);
        }
    }
    return valid;
}
