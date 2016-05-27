var cheerio = require('cheerio'),
	request = require('request');

var URL_LOGIN = 'https://siac.ufba.br/SiacWWW/LogonSubmit.do';
var URL_WELCOME = 'https://siac.ufba.br/SiacWWW/Welcome.do';
var URL_TRANSCRIPT = 'https://siac.ufba.br/SiacWWW/ConsultarHistoricoEscolarEletronico.do';
var URL_GRADES = 'https://siac.ufba.br/SiacWWW/ConsultarCoeficienteRendimento.do'

function Ufba(parameters) {
	this.username = parameters.username;
	this.password = parameters.password;
	this.jar = request.jar();
	this.logged = false;
}

Ufba.prototype.login = function(callback) {
	request.post({
		url: URL_LOGIN, 
		form: {
			cpf: this.username, 
			senha: this.password
		}, 
		jar: this.jar
	}, function (err, httpResponse, body) {
		this.logged = true;
		callback(true);		
	});

};

Ufba.prototype.getWelcome = function(callback) {
	request({
		url: URL_WELCOME,
		jar: this.jar
	}, function (err, httpResponse, body) {
		var DOM = cheerio.load(body);
		var name = DOM('table').eq(4).find('tr td center b').html().trim();
		callback({
			name: name
		});
	});
};

Ufba.prototype.getTranscript = function(callback) {
	request({
		url: URL_TRANSCRIPT,
		jar: this.jar
	}, function (err, httpResponse, body) {
		callback(body);
	});
};

Ufba.prototype.getGrades = function(callback) {
	request({
		url: URL_GRADES,
		jar: this.jar
	}, function (err, httpResponse, body) {
		callback(body);
	});
};

module.exports = Ufba;