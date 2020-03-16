const _ = require('lodash')
    , cfg = require('./../config')
    , db  = require('./../db')
    , utils = require('./../utils')
    , mongo = require('mongodb')
    , Doodle = require('./../Classes/Doodle');

module.exports = function (bot) {
    return function (message, args) {
        if (!args[0]) return;
        try {
            var oid = new mongo.ObjectID(args[0]);
            db.getCollection().findOne({_id: oid}, (err, result) => {
                if (err || !result) return bot.sendMessage(new bot.classes.Message(message.chat.id, 'Sorry, something went wrong while opening your doodle. Please try again.'), () => {});
                utils.setDoodleActive(utils.deserializeDoodle(result), message.chat.id);
            });
        }
        catch (e) {}
    }
};
