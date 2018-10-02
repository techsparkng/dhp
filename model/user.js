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
  bank: [
    {
      bankname: String,
      accountnumber: String,
      accountname: String
    }
  ],
  paidto: String,
  address: String,
  mobile: String,
  package: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package"
    }
  ],
  deposits: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deposit"
    }
  ],
  withdrawal: Number,
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
