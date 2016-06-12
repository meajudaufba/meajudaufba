var cheerio = require('cheerio'),
	request = require('request'),
	iconv = require('iconv-lite');

var encoding = 'iso-8859-1';

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

// List of the siac URLs
var URL_LOGIN = 'https://siac.ufba.br/SiacWWW/LogonSubmit.do';
var URL_WELCOME = 'https://siac.ufba.br/SiacWWW/Welcome.do';
var URL_PAST_ENROLLMENTS = 'https://siac.ufba.br/SiacWWW/ConsultarComponentesCurricularesCursados.do';
var URL_TRANSCRIPT = 'https://siac.ufba.br/SiacWWW/ConsultarHistoricoEscolarEletronico.do';
var URL_GRADES = 'https://siac.ufba.br/SiacWWW/ConsultarCoeficienteRendimento.do';
var URL_MAJOR_INFORMATION = 'https://siac.ufba.br/SiacWWW/ConsultarCurriculoCurso.do';
var URL_REQUIRED_COURSES = 'https://siac.ufba.br/SiacWWW/ConsultarDisciplinasObrigatorias.do';

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
		jar: this.jar,
		encoding: null
	}, function (err, httpResponse, body) {
		var body = iconv.decode(body,encoding);
		try {
			var DOM = cheerio.load(body);
			var name = DOM('table').eq(4).find('tr td center b').html();

			var info = {
				name: name.trim().toLowerCase().capitalize()
			};

			this.logged = true;
			return callback(true, info);
		} catch (err) {
			console.log(err);
			return callback(false, false);
		}		
	});

};

Ufba.prototype.getWelcome = function(callback) {
	request({
		url: URL_WELCOME,
		jar: this.jar,
		encoding: null
	}, function (err, httpResponse, body) {
		var body = iconv.decode(body,encoding);

		var DOM = cheerio.load(body, { decodeEntities: false });
		var name = DOM('table').eq(4).find('tr td center b').html().trim();
		callback({
			name: name.replace(/\w/, str.match(/\w/)[0].toUpperCase())
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

Ufba.prototype.getRequiredCourses = function(callback) {
	request({
		url: URL_REQUIRED_COURSES,
		jar: this.jar,
		encoding: null
	}, function (err, httpResponse, body) {
		var body = iconv.decode(body,encoding);

		var courses = [];

		var DOM = cheerio.load(body);
		var transcriptElements = DOM('table').eq(6).find('tbody tr');

		transcriptElements.each(function(i, elem) {
			var transcriptCourse = DOM(elem);
			var transcriptCourseData = transcriptCourse.find('td');
			var courseName = transcriptCourseData.eq(3).text();
			var acronymCourseName = transcriptCourseData.eq(2).html();
			var prerequisites = transcriptCourseData.eq(4).html();

			if (courseName !== null && prerequisites !== null) {
				if (prerequisites == '--') {
					prerequisites = []
				} else {
					prerequisites = prerequisites.split(',')
				}

				courses.push({
					acronym: acronymCourseName,
					name: courseName.trim(),
					prerequisites: prerequisites,
				});
			}		
		});

		return callback(courses);
	});
};

Ufba.prototype.getCoursesDone = function(callback) {
	request({
		url: URL_PAST_ENROLLMENTS,
		jar: this.jar,
		encoding: null
	}, function (err, httpResponse, body) {
		var body = iconv.decode(body,encoding);

		var courses = [];

		var DOM = cheerio.load(body, { decodeEntities: false });
		var transcriptElements = DOM('table').eq(7).find('tr');

		transcriptElements.each(function(i, elem) {
			var transcriptCourse = DOM(elem);
			var transcriptCourseData = transcriptCourse.find('td');
			var courseName = transcriptCourseData.eq(2).html();
			var acronymCourseName = transcriptCourseData.eq(1).html();
			var ch = transcriptCourseData.eq(3).html();
			var nt = transcriptCourseData.eq(5).html();
			var score = transcriptCourseData.eq(6).html();
			var status = transcriptCourseData.eq(7).html();

			if (courseName !== null && status !== null) {
				courses.push({
					acronym: acronymCourseName,
					name: courseName.trim(),
					ch: ch,
					nt: nt,
					score: score,
					status: status
				});
			}			
		});

		return callback(courses);
	});
};

Ufba.prototype.getGrades = function(callback) {
	request({
		url: URL_GRADES,
		jar: this.jar
	}, function (err, httpResponse, body) {
		var DOM = cheerio.load(body, { decodeEntities: false });
		var registration = DOM('.cabecalho tr').eq(1).find('td').html().trim().slice(23);
		var gpa = DOM('.cabecalho tr td').eq(5).text().trim().slice(9);
		callback({
			registration: registration,
			gpa: gpa
		});
	});
};

Ufba.prototype.getMajorInformation = function(callback) {
	request({
		url: URL_MAJOR_INFORMATION,
		jar: this.jar
	}, function (err, httpResponse, body) {
		var DOM = cheerio.load(body, { decodeEntities: false});
		var majorMinCode = DOM('.even td').html().trim().slice(0, 3);
		var majorCode = DOM('.even td').html().trim().slice(0, 6);
		var majorName = DOM('.even td').html().trim().slice(8);
		var dayTime = DOM('.even td').eq(1).html();
		var minDuration = DOM('.even td').eq(2).html();
		var maxDuration = DOM('.even td').eq(3).html();
		var curriculumPeriod = DOM('.even td').eq(4).html();
		var avgDuration = DOM('tr.even td').eq(12).html().trim().slice(14);
		var professionDescription = DOM('.simple tr.even').eq(2).text().trim();

		// workLoad
			// Complementary Time;
		var majorComplementaryTime = DOM('tr.odd td').eq(2).html();
		var studentComplementaryTime = DOM('tr.odd td').eq(3).html();
			// Mandatory time
		var majorMandatoryTime = DOM('tr.even td').eq(9).html();
		var studentMandatoryTime = DOM('tr.even td').eq(10).html();
			// Elective time
		var majorElectiveTime = DOM('tr.odd td').eq(6).html();;
		var studentElectiveTime = DOM('tr.odd td').eq(7).html();;

		var majorTotalTime;
		var studentTotalTime;
		callback({
			majorMinCode: majorMinCode,
			majorCode: majorCode,
			majorName: majorName,
			minDuration: minDuration,
			professionDescription: professionDescription,
			avgDuration: avgDuration,
			maxDuration: maxDuration,
			dayTime: dayTime,
			curriculumPeriod: curriculumPeriod,
			majorComplementaryTime: majorComplementaryTime,
			studentComplementaryTime: studentComplementaryTime,
			majorMandatoryTime: majorMandatoryTime,
			studentMandatoryTime: studentMandatoryTime,
			majorElectiveTime: majorElectiveTime,
			studentElectiveTime: studentElectiveTime
		})
	})
}

module.exports = Ufba;