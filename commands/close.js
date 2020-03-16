const _ = require('lodash')
    , cfg = require('./../config')
    , db  = require('./../db')
    , utils = require('./../utils')
    , Doodle = require('./../Classes/Doodle');

module.exports = function (bot) {
    return function (message, args) {
        var doodle = utils.getActiveDoodleByChat(message.chat.id);
        if (!doodle) return bot.sendMessage(new bot.classes.Message(message.chat.id, `Sorry, there is no active doodle in this conversation.`, 'Markdown'), () => {});
        if (message.from.id != doodle.creator) return bot.sendMessage(new bot.classes.Message(message.chat.id, `Sorry, only the creator of the doodle is authorized to close it.`, 'Markdown'), () => {});

        utils.setDoodleNonActive(message.chat.id);
        bot.sendMessage(new bot.classes.Message(message.chat.id, `Doodle closed. Here are the results:\n\n${doodle.serialize(doodle.id, true)}`, 'Markdown'), () => {});
    }
};
