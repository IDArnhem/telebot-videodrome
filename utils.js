const cfg = require('./config')
    , _ = require('lodash')
    , Doodle = require('./Classes/Doodle')
    , db  = require('./db')
    , mongo = require('mongodb')
    , DoodleDate = require('./Classes/DoodleDate');

var pendingDoodles = {}
, activeDoodles = {};

function addPending(doodle, chatId) {
    pendingDoodles[chatId] = doodle;
}

function getPendingByUserId(userId) {
    return pendingDoodles[userId] || null;
}

function removePendingByUserId(userId) {
    delete pendingDoodles[userId];
}

function setDoodleActive(doodle, chatId) {
    activeDoodles[chatId] = doodle;
}

function setDoodleNonActive(chatId) {
    delete activeDoodles[chatId];
}

function getActiveDoodleByChat(chatId) {
    return activeDoodles[chatId];
}

function deserializeDoodle(jsonDataFromDb) {
    var d = new Doodle(jsonDataFromDb.title, jsonDataFromDb.creator);
    d.setId(jsonDataFromDb._id);
    _.forEach(jsonDataFromDb.dates, (date) => {
        var dd = new DoodleDate(date.date, date.withoutTime);
        dd.setVotes(date.votes);
        d.addDate(dd);
    });
    return d;
}

function saveVote(doodle, index, from, successCallback, errorCallback) {
    var date = doodle.getDateByIndex(index);
    if (!date) return errorCallback();

    date.addVote(from.id, from.first_name || from.username);
    db.getCollection().updateOne(
        {_id: new mongo.ObjectID(doodle.id)},
        {
            $set: {dates: doodle.dates}
        }, (err, results) => {
            if (err || !results || !results.modifiedCount) return errorCallback();
            return successCallback();
        }
    );
}

module.exports = {
    addPending: addPending,
    getPendingByUserId: getPendingByUserId,
    getPending: function () {return pendingDoodles;},
    removePendingByUserId: removePendingByUserId,
    setDoodleActive: setDoodleActive,
    setDoodleNonActive: setDoodleNonActive,
    deserializeDoodle: deserializeDoodle,
    getActive: function () {return activeDoodles;},
    getActiveDoodleByChat: getActiveDoodleByChat,
    saveVote: saveVote
};