var express 		= require('express'),
	bodyParser      = require('body-parser'),
	app 			= express();

app.set('port', (process.env.PORT || 5000));

// Get base directory
var cwd = process.cwd();

// Importing routes
var routes = require('./app/core/routes');

// to support JSON-encoded bodies
app.use(bodyParser.json());       
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); 

app.use(express.static(cwd + '/static'));

app.use('/', routes);

app.listen(app.get('port'), function (err) {
    if (err) {
        console.error(err)
    } else {
        console.log('App is ready at : ' + app.get('port'));
    }
});