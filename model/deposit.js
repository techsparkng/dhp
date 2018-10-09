var mongoose = require("mongoose");

var depositSchema = new mongoose.Schema({
  amount: Number,
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package"
  },
  depositor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  bank: {
    accountname: String,
    accountno: String,
    bankname: String
  },
  approved: {
    type: Boolean,
    default: false
  },
  declined: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Deposit", depositSchema);
