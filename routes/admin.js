const express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
  moment = require('moment-business-days'),
  LocalStrategy = require("passport-local");

//Load User Model
const User = require("../model/user");
//Load Deposit Model
const Deposit = require("../model/deposit");
// Load Package Model
const Package = require("../model/package");
// Load Withdrawal Model
const Withdrawal = require("../model/withdrawal");

router.get("/updateProfile", ensureLoggedIn('/admin'),function(req, res) {
  res.render("admin/updateProfile");
});

// @route   POST route/profile
// @desc    Update Admin profile
// @access  Private

router.post("/updateProfile", ensureLoggedIn('/admin'), (req, res) => {
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

router.get("/index", ensureLoggedIn('/admin'), function(req, res) {
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
          Withdrawal.find({}, function(err, foundWithdrawals) {
            if (err) {
              console.log(err);
            } else {
              data.totalWithdrawalsCount = foundWithdrawals.length;
              res.render("admin/index", {data: data});
            }
          })
        }
      });
    }
  });
});

// @route   GET admin/deposit
// @desc    Get all investment Depositss
// @access  Private

router.get("/deposit", ensureLoggedIn('/admin'), function(req, res) {
  
  Deposit.find({approved: false, declined: false}).populate("depositor").populate("package").exec(function(err, pendingDeposits){
    if(err){
        console.log(err);
    }else{
        var pendingDeposits = pendingDeposits;
        Deposit.find({approved: true, declined:false}).populate("depositor").populate("package").exec(function (err, approvedDeposits) {
          if (err) {
            console.log(err);
          } else {
            var approvedDeposits = approvedDeposits;
            Deposit.find({declined: true}).populate("depositor").populate("package").exec(function(err, declinedDeposits) {
              if (err) {
                console.log(err);
              } else {
                var declinedDeposits = declinedDeposits;
                res.render("admin/deposit", {approvedDeposits: approvedDeposits, pendingDeposits: pendingDeposits, declinedDeposits: declinedDeposits});
              }
            })
          }
        })
    }
  });
});

// approve deposit route
router.put('/deposit/:id', ensureLoggedIn('/admin'), function(req, res) {
  Deposit.findByIdAndUpdate(req.params.id, {approved: true}, {new: true}).populate("package").exec(function(err, updatedDeposit) {
    if (err) {
      console.log(err)
    } else {
      var startDate = moment()._d;
      var endDate = moment().businessAdd(updatedDeposit.package.duration)._d;
      var nextWithdrawDate = moment().businessAdd(7)._d;
      Package.findByIdAndUpdate(updatedDeposit.package, {start: startDate, lastWithdraw: startDate, nextWithdraw: nextWithdrawDate, end: endDate, amountDeposited: updatedDeposit.amount, approved: true}, {new: true}, function(err, updatedPackage) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('back');
        }
      });
    }
  })
})

// decline deposit route
router.delete('/deposit/:id', ensureLoggedIn('/admin'), function(req, res) {
  Deposit.findByIdAndUpdate(req.params.id, {declined: true}, {new: true}, function(err, updatedDeposit) {
    if (err) {
      console.log(err)
    } else {
      Package.findByIdAndUpdate(updatedDeposit.package, {approved: false}, function(err, updatedPackage) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('back');
        }
      })
    }
  })
})

//undo approve deposit route
router.put('/undodeposit/:id', ensureLoggedIn('/admin'), function(req, res) {
  Deposit.findByIdAndUpdate(req.params.id, {approved: false}, {new: true}, function(err, updatedDeposit) {
    if (err) {
      console.log(err)
    } else {
      Package.findByIdAndUpdate(updatedDeposit.package, {approved: false}, function(err, updatedPackage) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('back');
        }
      })
    }
  })
})

//undo decline deposit route
router.delete('/undodeposit/:id', ensureLoggedIn('/admin'), function(req, res) {
  Deposit.findByIdAndUpdate(req.params.id, {declined: false}, {new: true}, function(err, updatedDeposit) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('back');
    }
  })
})

// @route   GET admin/withdraw
// @desc    Get all requested Withdrawal
// @access  Private

router.get("/withdraw", ensureLoggedIn('/admin'), function(req, res) {
  Withdrawal.find({approved: false, declined: false}).populate("withdrawer").populate("package").exec(function(err, pendingWithdrawals){
    if(err){
        console.log(err);
    }else{
        var pendingWithdrawals = pendingWithdrawals;
        Withdrawal.find({approved: true, declined:false}).populate("withdrawer").populate("package").exec(function (err, approvedWithdrawals) {
          if (err) {
            console.log(err);
          } else {
            var approvedWithdrawals = approvedWithdrawals;
            Withdrawal.find({declined: true}).populate("withdrawer").populate("package").exec(function(err, declinedWithdrawals) {
              if (err) {
                console.log(err);
              } else {
                var declinedWithdrawals = declinedWithdrawals;
                res.render("admin/withdraw", {approvedWithdrawals: approvedWithdrawals, pendingWithdrawals: pendingWithdrawals, declinedWithdrawals: declinedWithdrawals});
              }
            })
          }
        })
    }
  });
});

// approve withdrawal route
router.put('/withdraw/:id', ensureLoggedIn('/admin'), function(req, res) {
  Withdrawal.findByIdAndUpdate(req.params.id, {approved: true}, {new: true}).populate("package").exec(function(err, updatedWithdrawal) {
    if (err) {
      console.log(err)
    } else {
      updatedWithdrawal.package.nextWithdraw = moment().businessAdd(7)._d;
      res.redirect('back');
    }
  })
})

// decline withdrawal route
router.delete('/withdraw/:id', ensureLoggedIn('/admin'), function(req, res) {
  Withdrawal.findByIdAndUpdate(req.params.id, {declined: true}, {new: true}, function(err, updatedWithdrawal) {
    if (err) {
      console.log(err)
    } else {
      res.redirect("back");
    }
  })
})

//undo approve withdrawal route
router.put('/undowithdraw/:id', ensureLoggedIn('/admin'), function(req, res) {
  Withdrawal.findByIdAndUpdate(req.params.id, {approved: false}, {new: true}).populate("package").exec(function(err, updatedWithdrawal) {
    if (err) {
      console.log(err)
    } else {
      updatedWithdrawal.package.nextWithdraw = moment().businessAdd(-7)._d;
      res.redirect("back");
    }
  });
})

//undo decline withdrawal route
router.delete('/undowithdraw/:id', ensureLoggedIn('/admin'), function(req, res) {
  Withdrawal.findByIdAndUpdate(req.params.id, {declined: false}, {new: true}, function(err, updatedWithdrawal) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('back');
    }
  })
})

module.exports = router;
