const _ = require('lodash')
    , cfg = require('./../config')
    , db  = require('./../db')
    , utils = require('./../utils')
    , Doodle = require('./../Classes/Doodle');

module.exports = function (bot) {
    return function (message, args) {
        var doodle = utils.getPendingByUserId(message.chat.id);

        if (!doodle) return bot.sendMessage(new bot.classes.Message(message.chat.id, `There is no pending doodle to add a date to. You need to type \`${cfg.COMMANDS.NEW} <title>\` first.`, 'Markdown'), () => {});
        if (!doodle.dates.length) return bot.sendMessage(new bot.classes.Message(message.chat.id, `The doodle you tried to open has no dates. Add some using the \`${cfg.COMMANDS.DATE}\` command.`, 'Markdown'), () => {});

        db.getCollection().insert(doodle, (err, ok) => {
            if (err) bot.sendMessage(new bot.classes.Message(message.chat.id, 'Sorry, something went wrong while opening your doodle. Please try again.'), () => {});
            else {
                doodle.setId(ok.insertedIds[0].toString());
                utils.removePendingByUserId(message.chat.id);
                utils.setDoodleActive(doodle, message.chat.id);

                var keyboard = new bot.classes.InlineKeyboard(4);
                for (var i = 0; i < doodle.dates.length; i++) {
                    keyboard.addButton(new bot.classes.InlineKeyboardButton(i.toString(), '', i.toString(), ''));
                }
                bot.sendMessage(new bot.classes.Message(message.chat.id, doodle.serialize(ok.insertedIds[0].toString()), 'Markdown', null, null, null, keyboard), (a, b) => {});
            }
        });
    }
};
