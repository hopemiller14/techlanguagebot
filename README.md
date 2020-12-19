# Tech Language Bot
Slack bot user who automatically responds with an ephemeral message whenever you use one of the 'bad words' and suggests another word to use instead


## Local Dev
### First time

1. ``` cp .envrc.example .envrc ```
1. Paste your app's workspace URL into .envrc.
1. Get an OAuth access token for your bot from Slack (see [here](https://api.slack.com/authentication/token-types#bot)), and paste it into .envrc.
    1. Give your bot the following Bot Token Scopes:
        * channels:history
        * channels:read
        * chat:write
        * groups:history
        * groups:read
        * users:read
1. Get the signing secret for your bot from Slack (see [here](https://api.slack.com/authentication/verifying-requests-from-slack)), and paste it into .envrc.
1. Create a username for your bot in Slack, and paste it into into .envrc.
1. terminal window 1:
    1. ``` yarn ```
    1. ``` yarn start-ngrok ```
    1. Copy the https Forwarding URL from the ngrok output; e.g. https://98fbc0c341db.ngrok.io
    1. In Slack go to your bot's Event Subscriptions page. In Request URL paste in the ngrok URL + /slack/events.
1. terminal window 2:
    1. ``` yarn verify ```
    1. On the Event Subscriptions page in Slack and wait until your app is successfully verified (you might have to click Retry).
    1. On the Event Subscriptions page, Subscribe to the following Bot Events:
            * message.channels
            * message.groups
    1. Click Save Changes at the bottom of the page.
    1. Once your app is successfully verified, you can kill the process in window 2.


### Every time
1. terminal window 1:
    1. ``` yarn start ```
1. in terminal window 2:
    1. ``` yarn start-ngrok ```
    1. Copy the https Forwarding URL from the ngrok output; e.g. https://98fbc0c341db.ngrok.io
    1. In Slack go to your bot's Event Subscriptions page. In Request URL paste in the ngrok URL + /slack/events.
    1. Wait until your app is successfully verified, then click Save Changes.


## Run the tests
``` yarn test ```


## Questions
ex: bad words are "cat", "dog"
* What happens when user uses multiple words in same message? _"It's raining cats and dogs!"_
    * Send one slack message per bad word.
* What about when using multiple of the same word in the same message? _"Here a cat. There a cat. Everywhere a cat. Cat."_
    * Do not send multiple messages for multiple uses of the same word in the same message.
* What about substrings? _"Do you want to go play **cat**ch?"_
    * Bot is triggered. (Hopefully this will be a small price to pay given our list of bad words.)
* What about totally appropriate context? _"We're no longer going to say the words 'cat' and 'dog' because they are bad."_
    * Bot is triggered.
* Editing messages:
    * What happens when a user posts a harmless message, then they edit it and add a bad word?
        * Nothing happens on initial post. Bot is triggered on edit.
    * What happens when a user posts a message with a bad word, then they edit it and remove the bad word?
        * Bot is triggered on initial post. Nothing happens on edit.
    * What happens when a user posts a message with a bad word, then they edit it but leave the bad word unchanged?
        * Bot is triggered on initial post and again on edit.
    * What happens when a user posts a message with a bad word, then they edit it and add a different bad word?
        * Bot is triggered on initial post and again on edit.
* Deleting messages:
    * What happens when a user posts a harmless message, then they delete it?
        * Nothing.
    * What happens when a user posts a harmless message, then another user deletes it?
        * Nothing.
    * What happens when a user posts a message with a bad word, then they delete it?
        * Bot is triggered for initial posting of message. Nothing happens on delete.
    * What happens when a user posts a message with a bad word, then another user deletes it?
        * Bot is triggered for initial posting of message. Nothing happens on delete.
* Sharing messages:
    * What happens when a user shares a harmless message with a channel and writes no message text?
        * Nothing.
    * What happens when a user shares a message with a bad word with a channel and writes no message text?
        * Bot is triggered on initial posting of message. ...Bot is triggered again on sharing? and sends a message to... both users? only the sharing user?
            * Current behavior: Bot is triggered on initial post. Nothing happens on share.
    * What happens when a user shares a harmless message with a channel and writes harmless message text?
        * Nothing.
    * What happens when a user shares a message with a bad word with a channel and writes harmless message text?
        * Bot is triggered on initial posting of message. ...Bot is triggered again on sharing? and sends a message to... both users? only the sharing user?
            * Current behavior: Bot is triggered on initial post. Nothing happens on share.
    * What happens when a user shares a harmless message with a channel and writes a bad word in the message text?
        * Nothing happens on initial post. Bot is triggered on sharing and sends message to sharing user.
    * What happens when a user shares a message with a bad word with a channel and writes a bad word in the message text?
        * Bot is triggered on initial post. Bot is triggered on sharing and sends message to sharing user.
* Copying links to messages:
    * What happens when a user copies a link to a harmless message in a public channel and posts it in another channel?
        Nothing.
    * What happens when a user copies a link to a message with a bad word in a public channel and posts it in another channel?
        * Bot is triggered on initial posting of message. ...Bot is triggered again on posting copied message link? and sends a message to... both users? only the copying user?
            * Current behavior: Bot is triggered on initial post. Nothing happens on posting copied link.
    * What happens when a user copies a link to a harmless message in a private channel and posts it in another channel?
        Nothing.
    * What happens when a user copies a link to a message with a bad word in a private channel and posts it in another channel?
        * Bot is triggered on initial posting of message. ...Bot is triggered again on posting copied message link? and sends a message to... both users? only the copying user?
            * Current behavior: Bot is triggered on initial post. Nothing happens on posting copied link.
* Threads:
    * What happens when a user posts or edits a harmless message in a channel?
        * Nothing.
    * What happens when a user posts or edits a bad message in a channel?
        * Bot replies in channel.
    * What happens when a user posts or edits a harmless message in a thread?
        * Nothing.
    * What happens when a user posts or edits a bad message in a thread?
        * Bot replies in thread.
    * What happens when a user shares or copies/pastes a link to a harmless message in a channel?
        * Nothing.
    * What happens when a user shares or copies/pastes a link to a bad message in a channel?
        * Bot replies to message sharer in channel.
    * What happens when a user shares or copies/pastes a link to a harmless message in a thread?
        * Nothing.
    * What happens when a user shares or copies/pastes a link to a bad message in a thread?
        * Bot replies to message sharer in thread.


## TODO
* filter out messages from all bot users? or maybe instead broadcast to entire channel since only the bot would see it
* future idea: keep track of # of occurrences of each bad word
    * break down by bot users vs real users?
    * keep track in a DB
    * user type: [bot | real], ts, word
    * could create a new endpt for querying
* future idea: make words configurable by channel
    * maybe make slack bot interactable?
* how to handle "resources" and "worker"? impossible to distinguish between person vs machine


## Resources
https://lifehacker.com/ditch-these-racist-terms-from-your-tech-vocabulary-1844041452
https://open.nytimes.com/finding-the-right-words-491b93b8b668
https://api.slack.com/authentication/basics#start
https://api.slack.com/events-api
https://api.slack.com/events
https://slack.dev/node-slack-sdk/getting-started
https://slack.dev/node-slack-sdk/tutorials/local-development
https://api.slack.com/scopes
