var mongoose = require("mongoose");

var packageSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  amountDeposited: Number,
  investtype: String,
  interest: Number,
  start: Date,
  end: Date,
  duration: Number,
  approved: {type: Boolean, default: false},
  currentEarning: Number
});

module.exports = mongoose.model("Package", packageSchema);
