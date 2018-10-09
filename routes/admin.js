const express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local");

//Load User Model
const User = require("../model/user");
//Load Deposit Model
const Deposit = require("../model/deposit");

router.get("/updateProfile", function(req, res) {
  res.render("admin/updateProfile");
});

// @route   POST route/profile
// @desc    Update Admin profile
// @access  Private

router.post("/updateProfile", (req, res) => {
  var userData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    gender: req.body.gender,
    phonenum1: req.body.phonenum1,
    phonenum2: req.body.phonenum2,
    address: req.body.address,
    
  };
  Admin.findByIdAndUpdate(
    req.user._id,
    userData,
    {
      new: true
    },
    function(err, updatedAdminUser) {
      if (err) {
        console.log(err);
      } else {
        console.log(updatedAdminUser);
        res.redirect("/admin/dashboard");
      }
    }
  );
});


// @route   GET admin/index
// @desc    Admin Dashboard
// @access  Private

router.get("/index", function(req, res) {
  console.log(req.user);
  var data = {};

  User.find({}, function(err, foundUsers){
    if(err){
      console.log(err);
    }else{
      data.totalUsers = foundUsers.length;
      Deposit.find({}, function(err, foundDeposits){
        if(err){
          console.log(err);
        }else{
          data.totalDepositsCount = foundDeposits.length;
          data.totalDepositsAmount = foundDeposits.reduce(function(acc, cur){
              return acc + cur.amount;
          }, 0);
          // console.log(data.totalDepositsAmount)
          // console.log(data.totalDepositsCount);
          // console.log(data.totalUsers);
          res.render("admin/index", {data: data});
        }
      });
    }
  });
});

// @route   GET admin/deposit
// @desc    Get all investment Depositss
// @access  Private

router.get("/deposit", function(req, res) {
  
  Deposit.find({approved: false}).populate("depositor").populate("package").exec(function(err, pendingDeposits){
    if(err){
        console.log(err);
    }else{
        var pendingDeposits = pendingDeposits;
        Deposit.find({approved: true}).populate("depositor").populate("package").exec(function (err, approvedDeposits) {
          if (err) {
            console.log(err);
          } else {
            var approvedDeposits = approvedDeposits;
            Deposit.find({declined: true}).populate("depositor").populate("package").exec(function(err, declinedDeposits) {
              if (err) {
                console.log(err);
              } else {
                var declinedDeposits = declinedDeposits;
                // res.render("admin/deposit", {approvedDeposits: approvedDeposits, pendingDeposits: pendingDeposits, declinedDeposits: declinedDeposits});
                res.send({approvedDeposits: approvedDeposits, pendingDeposits: pendingDeposits, declinedDeposits: declinedDeposits})
              }
            })
          }
        })
    }
  });
});

router.put(':id/approveDeposit', function(req, res) {
  Deposit.findByIdAndUpdate(req.params.id, {approved: true}, {new: true}, function(err, updatedDeposit) {
    if (err) {
      console.log(err)
    } else {
      res.send(updatedDeposit);
    }
  })
})

// @route   GET admin/withdraw
// @desc    Get all requested Withdrawal
// @access  Private

router.get("/withdraw", function(req, res) {
  res.render("admin/withdraw");
});

module.exports = router;
