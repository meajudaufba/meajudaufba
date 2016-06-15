var config = require('./config.js');

var express 		= require('express'),
	bodyParser      = require('body-parser'),
	app 			= express();

var models = require('./app/models');

// Get base directory
var cwd = process.cwd();

// Importing routes
var routes = require('./app/core/routes');

// to support JSON-encoded bodies
app.use(bodyParser.json());       
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); 

app.use(express.static(cwd + '/client/build'));

app.use('/api', routes);

app.get('/*', function(req, res) {
	res.sendFile(cwd + '/client/build/index.html');
});

models.sequelize.sync(/*{force: true}*/).then(function() {
	app.listen(config.PORT, config.IP, function (err) {
	    if (err) {
	        console.error(err)
	    } else {
	        console.log('App is ready at : ' + config.PORT);
	    }
	});
});