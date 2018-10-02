var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var packageSchema = new mongoose.Schema({
    type: String,
    interest: Number,
    start: Date,
    end: Date,
    duration: Number,
});

packageSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Package', packageSchema);