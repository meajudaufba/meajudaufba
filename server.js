var express 		= require('express'),
	bodyParser      = require('body-parser'),
	app 			= express(),
	Ufba 			= require('./api/ufba/ufba.js');

app.set('port', (process.env.PORT || 5000));

// Get base directory
var cwd = process.cwd();

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

	user.login(function(logged, info) {
		if (logged) {
			user.getRequiredCourses(function(requiredCourses) {
				user.getPastEnrollments(function(completedCourses) {
					var completedCourseStatus = {};
					var courses = [];
					var approvedCount = 0;
					var missingRequiredCount = 0;

					for (var i = 0; i < completedCourses.length; i++) {
						var courseStatus = {
							'AP': 1,
							'RP': 2,
							'TR': 3
						};

						if (courseStatus[completedCourses[i].status] == 1) {
							approvedCount++;
						}

						completedCourseStatus[completedCourses[i].acronym] = courseStatus[completedCourses[i].status];
					}

					for (var i = 0; i < requiredCourses.length; i++) {
						var requiredCourse = requiredCourses[i];
						var prerequisitesMissing = [];

						if (completedCourseStatus[requiredCourse.acronym] == undefined) {
							status = 4;
						} else {
							status = completedCourseStatus[requiredCourse.acronym];
						}

						if (status != 1) {
							missingRequiredCount++;
						}

						var unlockedCourses = unlockedCoursesBy(requiredCourse.acronym, requiredCourses);

						for (var j = 0; j < requiredCourse.prerequisites.length; j++) {
							var prerequisiteAcronym = requiredCourse.prerequisites[j];

							if (completedCourseStatus[prerequisiteAcronym] == undefined ||
								completedCourseStatus[prerequisiteAcronym] != 1) {
								prerequisitesMissing.push(prerequisiteAcronym);
							}							
						}

						if (prerequisitesMissing.length != 0) {
							status = 5;
						}

						courses.push({
							name: requiredCourse.name,
							acronym: requiredCourse.acronym,
							prerequisites: requiredCourse.prerequisites,
							prerequisitesMissing: prerequisitesMissing,
							unlockedCourses: unlockedCourses,
							status: status
						});	
					}				

					res.json({
						ok: true,
						data: {
							name: info.name,
							courses: courses,
							missingRequiredCount: missingRequiredCount,
							approvedCount: approvedCount
						}
					});
				});
			});
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


app.listen(app.get('port'), function (err) {
    if (err) {
        console.error(err)
    } else {
        console.log('App is ready at : ' + app.get('port'));
    }
});