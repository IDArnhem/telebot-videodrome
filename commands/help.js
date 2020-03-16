const cfg = require('./../config');


module.exports = function (bot) {
    const text = `
        Welcome to the DoodlerBot. This bot helps you coordinate a group of people and find the right date for a common appointment, just like you might know from \`doodle.com\`.
        
        *How to use this bot*
        Obviously this bot only makes real sense in a group chat. Add this bot as a member to the group you want to do the doodling with and then start typing the commands described below. Alternatively, if you don't want to spam your mates with those commands needed to set up a Doodle, you can use the *forward mode*. You create a Doodle (as described below) in a direct chat with this bot. As a result to the \`${cfg.COMMANDS.OPEN}\` command, you get a message starting with \`${cfg.COMMANDS.DOODLE}\`. You can now forward this message to any group chat this bot is member of and the voting will just work there.
        
        *Creating a new vote (aka. a _Doodle_)*
        1. \`${cfg.COMMANDS.NEW} School-class reunion\`
        
        To create a new Doodle, you need to give it a title, namely what should be voted for.
        
        
        *Adding dates a a new Doodle*
        1. \`${cfg.COMMANDS.DATE} 2016-05-31\` or
        2. \`${cfg.COMMANDS.DATE} 2016-05-31 21:00\`
        
        To add a date to a recently created vote, you need to pass a date in the format of \`yyyy-mm-dd\` and optionally with a time in the format of \`hh:MM\`, where _y_ means _year_, _m_ means _month_, _d_ stand for _day_, _h_ for _hour_ and _M_ for minute.
        The first command above will add the 31st of May in 2016 as an option to the Doodle.
        
        Please note that even if you want, for instance, the second of a month, you need to type _02_, not only _2_. The same applies for years, days, hours and minutes.
        
        *Starting a Doodle*
        If you are finished adding dates to the doodle, you can start it, typing \`${cfg.COMMANDS.OPEN}\`.
        
        *Voting*
        The DoodlerBot posts a message to the group, where every date is mapped to a command, e.g. \`${cfg.COMMANDS.VOTE} 0\`. Typing that command lets you vote for the respective date.
        Alternatively you can simply click on the inline button below the vote. 
        
        *Finishing a Doodle*
        If everyone in the group has voted for her desired date or if you consider the voting time to be over you can stop the Doodle by typing \`${cfg.COMMANDS.CLOSE}\`. As a consequence, the result - namely the number of votes for each option - will be displayed. No more votes will be accepted now.
    `;
    return function (message, args) {
        bot.sendMessage(new bot.classes.Message(message.chat.id, text, 'Markdown'), (res) => {});
    }
};
