var mongoose = require("mongoose");

var messagesSchema = new mongoose.Schema({
  title: String,
  message: String,
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Messages", messagesSchema);
