var mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: String,
  gender: String,
  bank: [
    {
      bankname: String,
      accountnumber: String,
      accountname: String
    }
  ],
  address: String,
  mobile: {
    type: String,
    required: true
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package"
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
