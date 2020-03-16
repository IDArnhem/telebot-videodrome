const _ = require('lodash')
    , cfg = require('./../config')
    , db  = require('./../db')
    , mongo = require('mongodb')
    , utils = require('./../utils')
    , Doodle = require('./../Classes/Doodle');

module.exports = function (bot) {
    return function (message, args) {
        var doodle = utils.getActiveDoodleByChat(message.chat.id);
        
        if (!doodle) return bot.sendMessage(new bot.classes.Message(message.chat.id, `Sorry, there is no active doodle in this conversation.`, 'Markdown'), () => {});
        if (!args[0]) return bot.sendMessage(new bot.classes.Message(message.chat.id, `Please specify which date to vote for, e.g. \`/vote 0\`.`, 'Markdown'), () => {});

        var index = parseInt(args[0]);
        if (index >= doodle.dates.length) return bot.sendMessage(new bot.classes.Message(message.chat.id, `Sorry, *${index}* is not a valid option to vote.`, 'Markdown'), () => {});

        if (doodle.checkVoted(message.from.id, index)) return bot.sendMessage(new bot.classes.Message(message.chat.id, `${ message.from.first_name || message.from.username} has already voted in this doodle.`, 'Markdown'), () => {});

        utils.saveVote(doodle, index, message.from, () => {
            bot.sendMessage(new bot.classes.Message(message.chat.id, doodle.serialize(doodle.id), 'Markdown'), () => {});
        }, () => {
            bot.sendMessage(new bot.classes.Message(message.chat.id, `Sorry, there was an error while saving your vote. Please try again.`, 'Markdown'), () => {});
        });
    };
};
