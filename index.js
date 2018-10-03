var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  path = require("path"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  bodyParser = require("body-parser"),
  User = require("./model/user"),
  Admin = require("./model/admin"),
  userRoutes = require("./routes/user"),
  adminRoutes = require("./routes/admin");

mongoose.connect(
  "mongodb://diamond:buildthefuture123@ds113443.mlab.com:13443/dhp",
  {
    useNewUrlParser: true
  }
);

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/views")));
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

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.set("view engine", "ejs");

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.path = req.originalUrl;
  next();
});

app.get("/", function(req, res) {
  res.sendFile("index.html");
});

app.get("/dashboard", function(req, res) {
  res.render("dashboard/index");
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
    User.findByIdAndUpdate(user._id, req.body.user, { new: true }, function(
      err,
      updatedUser
    ) {
      if (err) {
        console.log(err);
      } else {
        console.log(updatedUser);
        passport.authenticate("local")(req, res, function() {
          res.redirect("/user/updateProfile");
        });
      }
    });
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
  passport.authenticate("local", {
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
  passport.authenticate("local", {
    successReturnToOrRedirect: "/admin/index",
    failureRedirect: "/admin/login"
  }),
  function(req, res) {}
);

// @route   GET route/admin
// @desc    Get Admin Dashboard
// @access  Private
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
    Admin.findByIdAndUpdate(user._id, req.body.admin, { new: true }, function(
      err,
      updatedAdmin
    ) {
      if (err) {
        console.log(err);
      } else {
        console.log(updatedAdmin);
        passport.authenticate("local")(req, res, function() {
          res.redirect("/admin/index");
        });
      }
    });
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
