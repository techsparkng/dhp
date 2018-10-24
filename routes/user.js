const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var moment = require("moment-business-days");

var ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;
//Load User Model
const User = require("../model/user");
//Load Package Model
const Package = require("../model/package");
// Load Deposit Model
const Deposit = require("../model/deposit");
// Load Withdrawal Model
const Withdrawal = require("../model/withdrawal");

// @route   GET route/profile
// @desc    Get current user profile page
// @access  Private

router.get("/updateProfile", ensureLoggedIn("/login"), function(req, res) {
  res.render("dashboard/updateProfile");
});

// @route   POST route/profile
// @desc    Update user profile
// @access  Private

router.post("/updateProfile", ensureLoggedIn("/login"), (req, res) => {
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

router.get("/invest", ensureLoggedIn("/login"), function(req, res) {
  res.render("dashboard/invest");
});

// @route   POST route/invest
// @desc    Update current user investment package plan
// @access  Private

router.post("/invest", ensureLoggedIn("/login"), function(req, res) {
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

router.get("/withdraw", ensureLoggedIn("/login"), function(req, res) {
  res.render("dashboard/withdraw");
});

router.post("/withdraw", ensureLoggedIn("/login"), function(req, res) {
  var remainder = req.body.currentEarning - req.body.amount;

  Package.findByIdAndUpdate(
    req.body.package,
    { remainder: remainder, lastWithdraw: new Date() },
    { new: true },
    function(err, foundPackage) {
      if (err) {
        console.log(err);
      } else {
        var withdrawal = {
          amount: req.body.amount,
          withdrawer: req.user._id,
          package: foundPackage._id
        };
        Withdrawal.create(withdrawal, function(err, createdWithdrawal) {
          if (err) {
            console.log(err);
          } else {
            console.log(foundPackage);
            res.redirect("back");
          }
        });
      }
    }
  );
});

router.get("/activePackages", ensureLoggedIn("/login"), function(req, res) {
  Package.find(
    { investor: req.user._id, approved: true, end: { $gte: new Date() } },
    function(err, foundPackages) {
      if (err) {
        console.log(err);
      } else {
        res.json(foundPackages);
      }
    }
  );
});

// @route   DELETE route/cancel
// @desc    Cancel Investment
// @access  Private

router.delete("/cancel/:id", ensureLoggedIn("/login"), function(req, res) {
  Deposit.findByIdAndRemove(req.params.id, function(err, deletedDeposit) {
    if (err) {
      console.log(err);
    } else {
      Package.findByIdAndRemove(deletedDeposit.package, function(
        err,
        deletedPackage
      ) {
        if (err) {
          console.log(err);
        } else {
          console.log(deletedPackage);
          console.log(deletedDeposit);
          res.status(200).json({ message: "deleted" });
        }
      });
    }
  });
});

module.exports = router;
