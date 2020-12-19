const strings = require('./strings.js');
const WORD_DICT = strings.word_dict;

const normalizeText = (text) => {
    return text.toLowerCase().replace(/(\s|-|'|")+/g, '')
}

const getBadWordsUsed = (message) => {
    const text = normalizeText(message);
    const badWords = Object.keys(WORD_DICT).filter(k => text.includes(normalizeText(k)));
    // don't double-count bad words that are substrings of other bad words
    if (strings.master_dupes.some(d => badWords.includes(d))) {
        const mrIdx = badWords.indexOf('master');
        badWords.splice(mrIdx, 1);
    }
    if (strings.slave_dupes.some(d => badWords.includes(d))) {
        const slIdx = badWords.indexOf('slave');
        badWords.splice(slIdx, 1);
    }
    return badWords;
}

const constructResponseMessage = (bad) => {
    return `Psst... Did you mean to say _${WORD_DICT[bad].join(', ')}_ instead of _${bad}_?`;
}

const getBadWordList = () => {
    const updatedString = new Date(strings.last_updated).toDateString();
    const response =
        `Here are the words that I know right now (_list last updated ${updatedString}_):\n
        ${Object.keys(WORD_DICT).join(', ')}\n
    If you have other suggestions, please reach out to ${strings.who_to_contact}!`;
    return response;
}


module.exports = {
    getBadWordsUsed,
    constructResponseMessage,
    getBadWordList
}
