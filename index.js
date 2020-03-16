const db = require('./db'),
    _ = require('lodash'),
    botlib = require('telegram-bot-sdk'),
    cfg = require('./config'),
    fs = require('fs'),
    path = require('path'),
    utils = require('./utils');

const recoveryFile = cfg.RECOVER_FILE.indexOf('/') === 0 ? cfg.RECOVER_FILE : path.normalize(__dirname + '/' + cfg.RECOVER_FILE)
var recover = null,
    initialOffset = null;

try {
    recover = require(recoveryFile);
    initialOffset = recover.offset + 1;
    if (recover.activeDoodles) {
        _.forEach(recover.activeDoodles, (val, key) => {
            var doodle = utils.deserializeDoodle(val);
            utils.setDoodleActive(doodle, key);
        });
    }
} catch (e) {
    initialOffset = 0;
}

const bot = botlib(cfg.BOT_TOKEN, null, processNonCommand, processInlineQuery, processCallbackQuery, 0);
const commands = {
    new: require('./commands/new')(bot),
    date: require('./commands/date')(bot),
    open: require('./commands/open')(bot),
    vote: require('./commands/vote')(bot),
    doodle: require('./commands/doodle')(bot),
    close: require('./commands/close')(bot),
    ping: require('./commands/ping')(bot),
    help: require('./commands/help')(bot)
};
bot.setCommandCallbacks(commands);

db.init(() => {
    if (cfg.WEBHOOK_MODE) bot.listen(cfg.PORT, cfg.BOT_TOKEN);
    else bot.getUpdates();
});

function processNonCommand(message) {}

function processInlineQuery(query) {}

function processCallbackQuery(query) {
    var message = query.message;

    var doodle = utils.getActiveDoodleByChat(message.chat.id);
    if (!doodle) return bot.answerCallbackQuery(query.id, 'Sorry, there is no active doodle in this conversation.', false, () => {});

    var index = parseInt(query.data);
    if (doodle.checkVoted(query.from.id, index)) return bot.answerCallbackQuery(query.id, 'You have already voted in this doodle.', false, () => {});

    utils.saveVote(doodle, index, query.from, () => {
        bot.answerCallbackQuery(query.id, `You have successfully voted for option ${index}`, false, () => {});
    }, () => {
        bot.answerCallbackQuery(query.id, 'Sorry, there was an error while saving your vote. Please try again.', false, () => {});
    });
}

/* In the unwanted case the bot crashes due to a malformed message that causes an exception the bot can't handle, we at least need to save the current offset
 (is incremented by one in initialization) so that the bot won't get stuck in a loop fetching this message on restart and crashing again. */
process.on('SIGINT', () => {
    fs.writeFileSync(recoveryFile, JSON.stringify({
        offset: bot.getOffset(),
        activeDoodles: utils.getActive()
    }));
    db.close();
    process.exit();
});