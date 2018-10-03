const express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local");

//Load User Model
const User = require("../model/user");
//Load Deposit Model
const Deposit = require("../model/deposit");

// @route   GET admin/index
// @desc    Admin Dashboard
// @access  Private

router.get("/index", function(req, res) {
  console.log(req.user);
  res.render("admin/index");
});

// @route   GET admin/deposit
// @desc    Get all investment Depositss
// @access  Private

router.get("/deposit", function(req, res) {
  
  Deposit.find({}).populate("investor").exec(function(err, foundDeposits){
    if(err){
        console.log(err);
    }else{
        res.render("admin/deposit", {deposits: foundDeposits});
    }
  });
  
});

// @route   GET admin/withdraw
// @desc    Get all requested Withdrawal
// @access  Private

router.get("/withdraw", function(req, res) {
  res.render("admin/withdraw");
});

module.exports = router;
