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
  bank: {
    bankname: String,
    accountname: String,
    accountnumber: String
  },
  paidto: String,
  address: String,
  phonenumber: String,
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
  withdrawals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Withdraw"
    }
  ],
  currentearning: Number,
  lastinvestorpackagedate: {type: Date, default: Date.now},
  lastpartnerpackagedate: {type: Date, default: Date.now},
  lastinternationalpackagedate: {type: Date, default: Date.now},
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
