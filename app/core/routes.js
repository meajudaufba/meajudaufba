// Get base directory
var cwd = process.cwd();

var config = require(cwd + '/config.js');

var TOKEN_SECRET = config.TOKEN_SECRET;

var express	= require('express'),
	routes	= express.Router(),
	fs		= require('fs'),
	jwt = require('jsonwebtoken');

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

function verifyToken(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (token) {
	    jwt.verify(token, TOKEN_SECRET, function(err, decoded) {
	        if (err) {
	            return res.json({
	                success: false,
	                message: 'Failed to authenticate token.',
	                code: 2001
	            });
	        } else {
	            // if everything is good, save to request for use in other routes
	            req.decoded = decoded;
	            next();
	        }
	    });
	} else {
	    return res.status(403).send({
	        success: false,
	        message: 'No token provided.',
	        code: 2002
	    });
	}
}

routes.post('/login', controllers.users.login);
routes.get('/me', verifyToken, controllers.users.me);

module.exports = routes;