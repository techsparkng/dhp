var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var packageSchema = new mongoose.Schema({
    type: String,
    interest: Number,
    start: {
        type: Date,
        default: Date.now
    },
    end: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: Date,
        default: Date.now
    }
});

packageSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Package', packageSchema);