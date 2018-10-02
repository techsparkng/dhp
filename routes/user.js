const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Load User Model
const User = require("../model/user");

// @route   GET route/profile
// @desc    Get current user profile page
// @access  Private

router.get("/updateProfile", function(req, res) {
  res.render("dashboard/updateProfile");
});

// @route   POST route/profile
// @desc    Update user profile
// @access  Private

router.post("/updateProfile", (req, res) => {
  var userData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    gender: req.body.gender,
    bank: req.body.bank,
    phonenumber: req.body.phonenumber,
    address: req.body.address
  };
  User.findByIdAndUpdate(req.user._id, userData, { new: true }, function(
    err,
    updatedUser
  ) {
    if (err) {
      console.log(err);
    } else {
      console.log(updatedUser);
      res.redirect("/dashboard");
    }
  });
});

router.get('/invest', function(req, res) {
  res.render('dashboard/invest');
})

module.exports = router;
