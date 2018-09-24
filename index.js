var express 	= require('express'),
	app			= express(),
	mongoose	= require('mongoose'),
	path		= require('path'),
	bodyParser 	= require('body-parser');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get('/', function(req, res) {
	res.sendFile('index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
	console.log(`DHP app running at port: ${PORT}`);
});