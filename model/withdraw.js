var mongoose = require("mongoose");

var withdrawSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Package", withdrawSchema);
