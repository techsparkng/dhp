var mongoose = require("mongoose");

var adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  email: String,
  mobile: Number,
  createdDate: {
    type: Date,
    defualt: Date.now
  }
});

module.exports = mongoose.model("Admin", adminSchema);
