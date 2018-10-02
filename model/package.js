var mongoose = require("mongoose");

var packageSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  investtype: String,
  interest: Number,
  start: Date,
  end: Date,
  duration: Number
});

module.exports = mongoose.model("Package", packageSchema);
