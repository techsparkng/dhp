const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Load User Model
const User = require("../model/user");
//Load Package Model
const Package = require("../model/package");

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

// @route   GET route/invest
// @desc    Get user investment plan
// @access  Private

router.get("/invest", function(req, res) {
  res.render("dashboard/invest");
});

// @route   POST route/invest
// @desc    Update current user investment package plan
// @access  Private

router.post("/invest", function(req, res) {
  req.body.package.interest = Number(
    req.body.package.interest.substring(
      0,
      req.body.package.interest.indexOf("%")
    )
  );

  req.body.package.duration = Number(
    req.body.package.duration.substring(
      0,
      req.body.package.interest.indexOf(" ")
    )
  );
  console.log(req.body.package.interest, req.body.package.duration);
  var investData = {
    package: req.body.package,
    lastdeposit: req.body.deposit
  };
  User.findByIdAndUpdate(req.user._id, investData, { new: true }, function(
    err,
    foundUser
  ) {
    if (err) {
      console.log(err);
    } else {
      foundUser.deposits.push(req.body.deposit);
      foundUser.save();
      console.log(foundUser);
    }
  });
});

module.exports = router;
