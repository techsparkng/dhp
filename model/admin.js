var mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");
var adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  email: String,
  registerdate: {
    type: Date,
    default: Date.now
  }
});

adminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Admin", adminSchema);
