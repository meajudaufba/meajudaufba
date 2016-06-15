var cheerio = require('cheerio'),
	request = require('request'),
	iconv = require('iconv-lite');

var encoding = 'iso-8859-1';

String.prototype.format = function() {
    var str = this.toString();
    if (!arguments.length)
        return str;
    var args = typeof arguments[0],
        args = (("string" == args || "number" == args) ? arguments : arguments[0]);
    for (arg in args)
        str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
    return str;
}

var URL_MAJOR = 'https://alunoweb.ufba.br/SiacWWW/CurriculoCursoGradePublico.do?cdCurso={majorCode}&nuPerCursoInicial={curriculumPeriod}';
var URL_MANDATORY_COURSE_LIST = 'https://alunoweb.ufba.br/SiacWWW/ConsultarDisciplinasObrigatoriasPublico.do';

var URL_MAJOR_SYLLABUS = 'https://alunoweb.ufba.br/SiacWWW/ListaDisciplinasEmentaPublico.do?cdCurso={majorCode}&nuPerCursoInicial={curriculumPeriod}';
var URL_MAJOR_SYLLABUS_LIST = 'https://alunoweb.ufba.br/SiacWWW/ListaCursosEmentaPublico.do?cdGrauCurso={level}';

function unlockedCoursesBy(courseAcronym, courses, onlyDirectly) {
	var unlockedCourses = [];

	for (var i = 0; i < courses.length; i++) {
		var course = courses[i];
		if (course.prerequisites.indexOf(courseAcronym) !== -1) {
			unlockedCourses.push(course.acronym);
		}
	}

	return unlockedCourses;
}

getRequiredCourses = function(requestOptions, callback) {
	request(requestOptions, function (err, httpResponse, body) {
		var body = iconv.decode(body,encoding);

		var courses = [];

		var DOM = cheerio.load(body);
		var transcriptElements = DOM('table').eq(0).find('tr');

		transcriptElements.each(function(i, elem) {
			if (i == 0 || i == 1) {
				return;
			}

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

		return callback(false, courses);
	});
};

exports.getCoursesByMajorCode = function(majorCode, curriculumPeriod, cb) {
	var jar = request.jar();

	var url = URL_MAJOR.format({
		majorCode: majorCode, 
		curriculumPeriod: curriculumPeriod
	});

	request({
		url: url,
		jar: jar,
		encoding: null
	}, function (err, httpResponse, body) {
		getRequiredCourses({
			url: URL_MANDATORY_COURSE_LIST,
			encoding: null,
			jar: jar
		}, function (err, requiredCourses) {
			var courses = [];

			for (var i = 0; i < requiredCourses.length; i++) {
				var requiredCourse = requiredCourses[i];

				var prerequisiteOf = unlockedCoursesBy(requiredCourse.acronym, requiredCourses);

				courses.push({
					name: requiredCourse.name,
					acronym: requiredCourse.acronym,
					prerequisites: requiredCourse.prerequisites,					
					prerequisiteOf: prerequisiteOf
				});	
			}	

			return cb(false, courses);
		});
	});
};

exports.getMajorsByLevelWithoutPrerequisites = function(level, cb) {
	var url = URL_MAJOR_SYLLABUS_LIST.format({
		level: level
	});

	request({
		url: url,
		encoding: null
	}, function (err, httpResponse, body) {
		var body = iconv.decode(body, encoding);

		if (err) {
			console.log('Error: ' + err);
			return;
		}

		var DOM = cheerio.load(body, {
			decodeEntities: false
		});

		var majors = [];
		var MajorRows = DOM('table').eq(1).find('tr');

		MajorRows.each(function(i, majorElement) {		
			if (i == 0) {
				return;
			}

			var major = DOM(majorElement);

			var majorCode = major.children('td').html();
			var majorDescription = major.find('td a').html();
			var majorURL = major.find('td a').attr('href');

			majors.push({
				code: majorCode,
				name: majorDescription,
				url: majorURL
			});
		});

		cb(false, {
			majors: majors
		});
	});
};

exports.getCoursesByMajorCodeWithoutPrerequisites = function(majorCode, curriculumPeriod, cb) {
	var url = URL_MAJOR_SYLLABUS.format({
		majorCode: majorCode, 
		curriculumPeriod: curriculumPeriod
	});

	request({
		url: url,
		encoding: null
	}, function (err, httpResponse, body) {
		var body = iconv.decode(body, encoding);

		if (err) {
			console.log('Error: ' + err);
			return;
		}

		var DOM = cheerio.load(body, {
			decodeEntities: false
		});			

		var majorInformationContainer = DOM('table').eq(1).find('tr');
		var majorCode = majorInformationContainer.eq(1).find('td').eq(0).html().slice(0,6);
		var majorName = majorInformationContainer.eq(1).find('td').eq(0).html().slice(9);
		var majorShift = majorInformationContainer.eq(1).find('td').eq(1).html();
		var majorMinDuration = majorInformationContainer.eq(1).find('td').eq(2).html();
		var majorMaxDuration = majorInformationContainer.eq(1).find('td').eq(3).html();
		var majorCurriculumPeriod = majorInformationContainer.eq(1).find('td').eq(4).html();
		var majorLegalInformation = majorInformationContainer.eq(3).find('td').html();
		var majorProfessionalDescription = majorInformationContainer.eq(5).find('td').html();

		majorInformation = {
			'code': majorCode,
			'name': majorName,
			'shift': majorShift,
			'minDuration': majorMinDuration,
			'maxDuration': majorMaxDuration,
			'curriculumPeriod': majorCurriculumPeriod,
			'legalInformation': majorLegalInformation,
			'professionalDescription': majorProfessionalDescription
		}
		
		var mandatoryCourses = [];

		var mandatoryCourseTable = DOM('table').eq(2);
		var mandatoryCourseRows = mandatoryCourseTable.find('tr');

		mandatoryCourseRows.each(function(i, course) {
			if (i == 0 || i == 1) {
				return;
			}

			var course = DOM(course);		
			
			var coursePeriod = course.find('td').eq(0).html();
			var courseCode = course.find('td').eq(1).html();
			var courseName = course.find('td a').html();
			var courseURL = course.find('td a').attr('href');
			var courseNature = course.find('td').eq(3).html();

			courseName = courseName.trim();

			var courseObject = {
				'period': coursePeriod,
				'code': courseCode,
				'name': courseName,
				'url': courseURL,
				'nature': courseNature
			}

			mandatoryCourses.push(courseObject);
		});

		var optativeCourses = [];

		var optativeCourseTable = DOM('table').eq(3);
		var optativeCourseRows = optativeCourseTable.find('tr');

		optativeCourseRows.each(function(i, course) {
			if (i == 0 || i == 1) {
				return;
			}

			var course = DOM(course);		
			
			var courseCode = course.find('td').eq(0).html();
			var courseName = course.find('td').eq(1).find('a').html();
			var courseURL = course.find('td').eq(1).find('a').attr('href');
			var courseNature = course.find('td').eq(2).html();

			courseName = courseName ? courseName.trim() : courseName;

			var courseObject = {
				'code': courseCode,
				'name': courseName,
				'url': courseURL,
				'nature': courseNature
			}

			optativeCourses.push(courseObject);	
		});

		cb (false, {
			majorInformation: majorInformation,
			mandatoryCourses: mandatoryCourses,
			optativeCourses: optativeCourses
		});
	});
}