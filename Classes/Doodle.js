"use strict";

const _ = require('lodash')
    , cfg = require('./../config.json');

class Doodle {
    constructor(title, creator) {
        this.title = title;
        this.creator = creator;
        this.id = 0;
        this.dates = [];
    };

    addDate(doodleDate) {
        doodleDate.setIndex(this.dates.length);
        this.dates.push(doodleDate);
    };

    checkVoted(userId, index) {
        if (_.isNumber(index)) return this.dates[index].checkVoted(userId);
        for (var i = 0;  i < this.dates.length; i++) {
            if (this.dates[i].checkVoted(userId)) return true;
        }
        return false;
    }

    getDateByIndex(index) {
        return this.dates[index] || null;
    }

    setId(id) {
        this.id = id;
    }

    serialize(id, short) {
        var string = '';
        if (!short) string += `${cfg.COMMANDS.DOODLE} ${id} \n\n`;
        string += `*${this.title}*\n\n`;
        var sortedDates = _.reverse(_.sortBy(this.dates, (o) => {return o.votes.length}));
        _(sortedDates).forEach((d) => {
           string += `*${d.votes.length} votes* - ${d.toString()} - \`${cfg.COMMANDS.VOTE} ${d.index}\`\n`;
        });
        return string;
    };
}

module.exports = Doodle;