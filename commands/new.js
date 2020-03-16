const _ = require('lodash')
    , cfg = require('./../config')
    , db  = require('./../db')
    , utils = require('./../utils')
    , Doodle = require('./../Classes/Doodle');

module.exports = function (bot) {
    return function (message, args) {
        var arg = _.join(args, ' ');
        if (_.isEmpty(arg)) return bot.sendMessage(new bot.classes.Message(message.chat.id, `Sorry, your command must look like this: \`${cfg.COMMANDS.NEW} <title>\`, e.g. \`${cfg.COMMANDS.NEW} Date for school reunion\``, 'Markdown'), () => {});

        utils.addPending(new Doodle(arg, message.from.id), message.chat.id);
        bot.sendMessage(new bot.classes.Message(message.chat.id, `New doodle created. Start adding dates now by typing \`${cfg.COMMANDS.DATE} yyyy-mm-dd hh:MM\``, 'Markdown'), () => {});
    }
};
