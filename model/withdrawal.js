var mongoose = require("mongoose");

var withdrawalSchema = new mongoose.Schema({
  amount: Number,
  package: String,
  withdrawer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
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

module.exports = mongoose.model("Withdrawal", withdrawalSchema);