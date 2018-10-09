const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
//Load User Model
const User = require("../model/user");
//Load Package Model
const Package = require("../model/package");
// Load Deposit Model
const Deposit = require("../model/deposit");

// @route   GET route/profile
// @desc    Get current user profile page
// @access  Private

router.get("/updateProfile", ensureLoggedIn('/login'), function(req, res) {
  res.render("dashboard/updateProfile");
});

// @route   POST route/profile
// @desc    Update user profile
// @access  Private

router.post("/updateProfile", ensureLoggedIn('/login'), (req, res) => {
  var userData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    gender: req.body.gender,
    phonenumber: req.body.phonenumber,
    address: req.body.address,
    bank: req.body.bank
  };
  User.findByIdAndUpdate(
    req.user._id,
    userData,
    {
      new: true
    },
    function(err, updatedUser) {
      if (err) {
        console.log(err);
      } else {
        console.log(updatedUser);
        res.redirect("/dashboard");
      }
    }
  );
});

// @route   GET route/invest
// @desc    Get user investment plan
// @access  Private

router.get("/invest", ensureLoggedIn('/login'), function(req, res) {
  res.render("dashboard/invest");
});

// @route   POST route/invest
// @desc    Update current user investment package plan
// @access  Private

router.post("/invest", ensureLoggedIn('/login'), function(req, res) {
  req.body.package.interest = Number(
    req.body.package.interest.substring(
      0,
      req.body.package.interest.indexOf("%")
    )
  );

  req.body.package.duration = Number(
    req.body.package.duration.substring(
      0,
      req.body.package.duration.indexOf(" ")
    )
  );
  console.log(req.body.package.interest, req.body.package.duration);
  // var investData = {
  //   package: req.body.package,
  //   deposit: req.body.deposit
  // };
  req.body.package.investor = req.user._id;

  // create package and save
  Package.create(req.body.package, function(err, createdPackage) {
    if (err) {
      console.log(err);
    } else {
      req.user.package.push(createdPackage);
      var depositData = {
        amount: req.body.amount,
        package: createdPackage._id,
        depositor: req.user._id,
        bank: req.body.bankd
      };
      Deposit.create(depositData, function(err, createdDeposit) {
        if (err) {
          console.log(err);
        } else {
          req.user.deposits.push(createdDeposit);
          req.user.save();
          res.redirect("/dashboard");
        }
      });
    }
  });
});

// @route   GET route/withdraw
// @desc    Get user withdrawal history
// @access  Private

router.get("/withdraw", ensureLoggedIn('/login'), function(req, res) {
  res.render("dashboard/withdraw");
});

// @route   POST route/withdraw
// @desc    Request for withdrawal
// @access  Private

router.post("/withdraw", ensureLoggedIn('/login'), function(req, res) {});

module.exports = router;
