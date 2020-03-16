const mongo = require('mongodb').MongoClient,
    cfg = require('./config');

var collDoodles = null;
var _db = null;

module.exports = {
    init: init,
    close: close,
    getCollection: function() {
        return collDoodles;
    }
};

function init(callback) {
    mongo.connect(cfg.DB_URL, (err, db) => {
        if (err) return console.log(err);
        else console.log('Connected to database.');
        _db = db;
        db.collection(cfg.DB_COLLECTION, (err, coll) => {
            if (err) return console.log(err);
            collDoodles = coll;
            callback();
        })
    });
}

function close() {
    _db.close();
}