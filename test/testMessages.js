const assert = require('assert');
const msgData = require('./messageData');

const { getBadWordsUsed, constructResponseMessage } = require('../src/helpers');


function iterateOverTestCases (testCasesObject) {
    testCasesObject.forEach(function (test) {
        it(`User message: ${test.userMsg}`, function (done) {
            const badWordsUsed = getBadWordsUsed(test.userMsg);
            assert.deepStrictEqual(badWordsUsed, test.badWordsUsed);
            if (test.responses) {
                badWordsUsed.forEach(function (word, index) {
                    const responseMsg = constructResponseMessage(word);
                    assert.strictEqual(responseMsg, test.responses[index]);
                });
            }
            done();
        });
    });
}

describe('Basic Messages and Feedback', function () {
    iterateOverTestCases(msgData.messagesFeedback);
});
describe('Bad Words Caught', function () {
    describe('Messages', function () {
        iterateOverTestCases(msgData.messages);
    });
});