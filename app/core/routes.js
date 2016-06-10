var express	= require('express'),
	routes	= express.Router(),
	fs		= require('fs');

// Get base directory
var cwd = process.cwd();

/**
 * Importing controllers classes 
 */
var controllers = {}, 
    controllers_path = cwd + '/app/controllers';

fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') != -1) {
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file);
    }
})

routes.get('/', function(req, res) {
	res.sendFile(cwd + '/static/index.html');
});

routes.post('/login', controllers.users.login);

module.exports = routes;