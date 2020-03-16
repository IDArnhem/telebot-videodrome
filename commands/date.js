const _ = require('lodash')
    , cfg = require('./../config')
    , db  = require('./../db')
    , utils = require('./../utils')
    , DoodleDate = require('./../Classes/DoodleDate')
    , Doodle = require('./../Classes/Doodle');

module.exports = function (bot) {
    return function (message, args) {
        var arg = _.join(args, ' ');
        var doodle = utils.getPendingByUserId(message.chat.id);

        if (!doodle) return bot.sendMessage(new bot.classes.Message(message.chat.id, `There is no pending doodle to add a date to. You need to type \`${cfg.COMMANDS.NEW} <title>\` first.`, 'Markdown'), () => {});

        if (/^(\d{4})\-(\d{2})\-(\d{2})$/.test(arg)) doodle.addDate(new DoodleDate(new Date(arg), true));
        else if (/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2})$/.test(arg)) doodle.addDate(new DoodleDate(new Date(arg), false));
        else return bot.sendMessage(new bot.classes.Message(message.chat.id, `Sorry, your command must look like this: \`${cfg.COMMANDS.DATE} yyyy-mm-dd hh:MM\`, e.g. \`${cfg.COMMANDS.DATE} 2016-05-31 09:42\` or \`${cfg.COMMANDS.DATE} 2016-05-31\``, 'Markdown'), () => {});

        bot.sendMessage(new bot.classes.Message(message.chat.id, `New date has been successfully added to the doodle. If you're finished adding dates, open the doodle for vote by typing \`${cfg.COMMANDS.OPEN}\`.`, 'Markdown'), () => {});
    }
};
