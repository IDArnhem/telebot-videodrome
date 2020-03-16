"use strict";

const df = require('dateformat');

class DoodleDate {
    constructor(date, withoutTime) {
        this.date = date;
        this.withoutTime = withoutTime;
        this.index = -1;
        this.votes = [];
    }

    addVote(userId,userName) {
        this.votes.push({userId: userId, userName: userName});
    }

    checkVoted(userId) {
        for (var i = 0; i < this.votes.length; i++) {
            if (this.votes[i].userId == userId) return true;
        }
        return false;
    }

    setVotes(votes) {
        this.votes = votes;
    }

    setIndex(index) {
        this.index = index;
    }

    toString () {
        if (this.withoutTime) return df(this.date, 'dddd, mmmm dS, yyyy');
        else return df(this.date, 'dddd, mmmm dS, yyyy, HH:MM');
    }
}

module.exports = DoodleDate;