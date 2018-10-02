var mongoose = require("mongoose");

var depositSchema = new mongoose.Schema({
  amount: Number,
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package"
  },
  bank: {
    accountname: String,
    accountno: String,
    bankname: String
  },
  approved: {type: Boolean, default: false},
  created: Date
});

module.exports = mongoose.model("Deposit", depositSchema);
