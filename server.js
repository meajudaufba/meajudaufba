var express 		= require('express'),
	bodyParser      = require('body-parser'),
	app 			= express(),
	Ufba 			= require('./api/ufba/ufba.js');

var PORT = 5080;

// Get base directory
var cwd = process.cwd();

// to support JSON-encoded bodies
app.use(bodyParser.json());       
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); 

app.use(express.static(cwd + '/static'));

app.get('/', function(req, res) {
	res.sendFile(cwd + '/static/index.html');
});

app.post('/login', function(req, res) {
	var formData        = req.body;

	var user = new Ufba({
		username: formData.cpf,
		password: formData.password,
	});

	user.login(function(logged) {
		if (logged) {
			user.getWelcome(function(welcome) {
				res.json({
					ok: true,
					data: welcome
				});
			});
			/*user.getGrades(function(res) {
				//console.log(res);
			});
			user.getMajorInformation(function(res) {
				///console.log(res);
			});*/
		} else {
			res.json({
				ok: false,
				data: {
					msg: 'CPF ou senha inválidos.'
				}
			});
		}
	});
});


app.listen(PORT, function (err) {
    if (err) {
        console.error(err)
    } else {
        console.log('App is ready at : ' + PORT);
    }
});