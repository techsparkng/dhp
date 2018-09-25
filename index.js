var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	path = require('path'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	User = require('./model/user');

mongoose.connect('mongodb://diamond:buildthefuture123@ds113443.mlab.com:13443/dhp')

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/views')));
app.use(bodyParser.urlencoded({
	extended: true
}));

//configure session
app.use(require('express-session')({
	secret: 'DHP is cool',
	resave: false,
	saveUninitialized: false
}));

//configure passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");

app.get('/', function (req, res) {
	res.sendFile('index.html');
});

app.get('/dashboard', function (req, res) {
	res.render('dashboard/index');
});

app.get('/register', function (req, res) {
	res.render('dashboard/register');
});

app.post('/register', function (req, res) {
	var newUser = new User({
		username: req.body.username
	});
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			console.log(err);
		}
		User.findByIdAndUpdate(user._id, req.body.user, {
			new: true
		}, function (err, updatedUser) {
			if (err) {
				console.log(err);
			} else {
				console.log(updatedUser);
				passport.authenticate("local")(req, res, function () {
					res.redirect('/dashboard');
				});
			}
		});
	})

});


app.get('/login', function (req, res) {
	res.render('dashboard/login');
});

app.post('/login', passport.authenticate('local', {
	successReturnToOrRedirect: '/dashboard',
	failureRedirect: '/login'
}), function (req, res) {

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
	console.log(`DHP app running at port: ${PORT}`);
});