const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Load User Model
const User = require("../model/user");
//Load Package Model
const Package = require("../model/package");

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
  User.findById(req.user._id, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
    }
  });
});

module.exports = router;
