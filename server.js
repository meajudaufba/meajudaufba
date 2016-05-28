var Ufba = require('./api/ufba.js');

var Ufba = require('./api/ufba/ufba.js');
var user = new Ufba({
	username: process.env.USERNAME,
	password: process.env.PASSWORD,
});

user.login(function(logged) {
	if (logged) {
		user.getWelcome(function(res) {
			console.log(res);
		});
		user.getGrades(function(res) {
			console.log(res);
		});
		user.getMajorInformation(function(res) {
			console.log(res);
		});
	}
});