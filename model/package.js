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
  lastWithdraw: Date,
  end: Date,
  duration: Number,
  approved: {type: Boolean, default: false},
  remainder: {type: Number, default: 0}
});

module.exports = mongoose.model("Package", packageSchema);
