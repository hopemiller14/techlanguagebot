const express = require('express');
const bodyParser = require('body-parser');

const { createEventAdapter } = require('@slack/events-api')
const { WebClient } = require('@slack/web-api')

const { getBadWords, constructResponse } = require('./helpers.js');

const app = express();
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const web = new WebClient(process.env.BOT_OAUTH_ACCESS_TOKEN);

app.use('/slack/events', slackEvents.expressMiddleware());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('port', process.env.PORT);
app.set('workspace_url', process.env.WORKSPACE_URL);
app.set('bot_oauth_token', process.env.BOT_OAUTH_ACCESS_TOKEN);
app.set('bot_username', process.env.BOT_USERNAME);

const callUsersList = (nextCursor = null) => {
    return new Promise(resolve => {
        resolve(web.users.list({
            limit: 200,
            cursor: nextCursor
        }));
    })
}

const getBotUserInfo = async () => {
    const botUsername = app.get('bot_username');
    let res = await callUsersList();
    let nextCursor = res.response_metadata.next_cursor;
    let botFilter = res.members.filter(m => m.is_bot && m.name === botUsername);
    while (botFilter.length < 1 && nextCursor !== '') {
        res = await callUsersList(nextCursor);
        botFilter = res.members.filter(m => m.is_bot && m.name === botUsername);
        nextCursor = res.response_metadata.next_cursor;
    }

    if (botFilter.length > 1) {
        console.log(`Error: Multiple Language Bot users found! (${botFilter.length})`);
    } else if (botFilter.length === 0) {
        console.log('Error: Language Bot user not found in users!');
    } else {
        app.set('bot_user_id', botFilter[0].id);
    }
}

const sendMessage = async (channel, user, threadTs, text) => {
    try {
        await web.chat.postEphemeral({
            channel: channel,
            user: user,
            text: text,
            thread_ts: threadTs
        });
    } catch (err) {
        console.log('Error sending message!', err);
    }
}

app.get('/', function(req, res){
  res.send('Language Bot');
});

app.listen(app.get('port'), () => {
    console.log(`Bot is listening on port ${app.get('port')}`);
    return getBotUserInfo()
});

slackEvents.on('message', (event) => {
    const botUserId = app.get('bot_user_id');
    let user, channel, text, threadTs;
    try {
        channel = event.channel;
        if (event.text) {
            text = event.text;
            user = event.user;
            threadTs = event.thread_ts || null;
        } else if (event.subtype === 'message_changed') {
            text = event.message.text;
            user = event.message.user;
            threadTs = event.message.thread_ts || null;
        }
    } catch (err) {
        console.log('Error receiving message!', err);
    }
    if (event.subtype !== 'message_deleted' && user !== botUserId && text !== undefined) {
        const badWordsUsed = getBadWords(text);
        if (badWordsUsed.length > 0) {
            badWordsUsed.forEach(w => {
                const msgTxt = constructResponse(w);
                sendMessage(channel, user, threadTs, msgTxt);
            });
        }
    }
})

slackEvents.on('error', console.error);