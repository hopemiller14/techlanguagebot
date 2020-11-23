const strings = require('./strings.js');
const WORD_DICT = strings.word_dict;
const MR_DUPES = strings.master_dupes;
const SL_DUPES = strings.slave_dupes;


const normalizeText = (text) => {
    return text.toLowerCase().replace(/(\s|-|'|")+/g, '')
}

const getBadWords = (message) => {
    const text = normalizeText(message);
    const badWords = Object.keys(WORD_DICT).filter(k => text.includes(normalizeText(k)));
    // don't double-count bad words that are substrings of other bad words
    if (MR_DUPES.some(d => badWords.includes(d))) {
        const mrIdx = badWords.indexOf('master');
        badWords.splice(mrIdx, 1);
    }
    if (SL_DUPES.some(d => badWords.includes(d))) {
        const slIdx = badWords.indexOf('slave');
        badWords.splice(slIdx, 1);
    }
    return badWords;
}

const constructResponse = (bad) => {
    return `Psst... Did you mean to say _${WORD_DICT[bad].join(', ')}_ instead of _${bad}_?`;
}

module.exports = {
    getBadWords,
    constructResponse
}