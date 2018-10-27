var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  path = require("path"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  User = require("./model/user"),
  ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn,
  Admin = require("./model/admin"),
  userRoutes = require("./routes/user"),
  adminRoutes = require("./routes/admin");

// mongoose.connect(
//   "mongodb://dhp:dhpdatabase123@dhp-shard-00-00-fgyex.mongodb.net:27017,dhp-shard-00-01-fgyex.mongodb.net:27017,dhp-shard-00-02-fgyex.mongodb.net:27017/test?ssl=true&replicaSet=dhp-shard-0&authSource=admin&retryWrites=true",
//   {
//     useNewUrlParser: true
//   }
// );

mongoose.connect(
  "mongodb://localhost/dhp",
  { useNewUrlParser: true }
);
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/views")));
app.use(express.static(path.join(__dirname, "/node_modules")));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//Configure session
app.use(
  require("express-session")({
    secret: "DHP is cool",
    resave: false,
    saveUninitialized: false
  })
);

//configure passport
app.use(passport.initialize());
app.use(passport.session());

passport.use("user", new LocalStrategy(User.authenticate()));

passport.use("admin", new LocalStrategy(Admin.authenticate()));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Admin.findById(id, function(err, user) {
    if (err) done(err);
    if (user) {
      done(null, user);
    } else {
      User.findById(id, function(err, user) {
        if (err) done(err);
        done(null, user);
      });
    }
  });
});

app.set("view engine", "ejs");

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.path = req.originalUrl;
  next();
});

app.get("/", function(req, res) {
  res.sendFile("index.html");
});

app.get("/dashboard", ensureLoggedIn("/login"), function(req, res) {
  User.findById(req.user._id)
    .populate({
      path: "deposits",
      populate: { path: "package" }
    })
    .exec(function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        var deposits = foundUser.deposits;
        // res.send(deposits);
        res.render("dashboard/index", { deposits: deposits });
      }
    });
});

app.get("/register", function(req, res) {
  res.render("dashboard/register");
});

app.post("/register", function(req, res) {
  var newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
    }
    User.findByIdAndUpdate(
      user._id,
      req.body.user,
      {
        new: true
      },
      function(err, updatedUser) {
        if (err) {
          console.log(err);
        } else {
          console.log(updatedUser);
          passport.authenticate("user")(req, res, function() {
            res.redirect("/user/updateProfile");
          });
        }
      }
    );
  });
});

// @route   GET route/dashboard/login
// @desc    Get User login UI
// @access  Public

app.get("/login", function(req, res) {
  res.render("dashboard/login");
});

// @route   POST route/admin/login
// @desc    Authenticate User
// @access  Public

app.post(
  "/login",
  passport.authenticate("user", {
    successReturnToOrRedirect: "/dashboard",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

// @route   GET route/admin/login
// @desc    Get Admin login UI
// @access  Private

app.get("/admin/login", function(req, res) {
  res.render("admin/login");
});

// @route   POST route/admin/login
// @desc    Authenticate Admin
// @access  Private
app.post(
  "/admin/login",
  passport.authenticate("admin", {
    successReturnToOrRedirect: "/admin/index",
    failureRedirect: "/admin/login"
  }),
  function(req, res) {}
);

// @route   GET route/admin
// @desc    Get Admin Dashboard
// @access  Private`
app.get("/admin", function(req, res) {
  res.render("admin/login");
});

// @route   GET route/admin
// @desc    Get Admin Dashboard
// @access  Private
app.get("/admin/register", function(req, res) {
  res.render("admin/register");
});

// @route   POST route/admin
// @desc    Register new Admin
// @access  Private
app.post("/admin/register", function(req, res) {
  var newAdmin = new Admin({
    username: req.body.username
  });
  Admin.register(newAdmin, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
    }
    Admin.findByIdAndUpdate(
      user._id,
      req.body.admin,
      {
        new: true
      },
      function(err, updatedAdmin) {
        if (err) {
          console.log(err);
        } else {
          console.log(updatedAdmin);
          passport.authenticate("admin")(req, res, function() {
            res.redirect("/admin/updateProfile");
          });
        }
      }
    );
  });
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log(`DHP app running at port: ${PORT}`);
});
