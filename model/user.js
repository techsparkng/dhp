var mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  email: String,
  avatar: String,
  gender: String,
  bank: [{
    bankname: String,
    accountnumber: String,
    accountname: String
  }],
  address: String,
  mobile: String,
  package: {
    type: String,
    interest: Number,
    start: Date,
    end: Date,
    duration: Number,
  },
  deposits: [Number],
  lastdeposit: Number,
  withdrawal: Number,
  depositstatus: Boolean,
  paid: Boolean,
  currentearning: Number,
  registerdate: {
    type: Date,
    default: Date.now
  },
  lastlogin: {
    type: Date,
    default: Date.now
  }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);