// Get base directory
var cwd = process.cwd();

var config = require(cwd + '/config.js');

var md5 = require('md5');
var async = require('async');
var jwt = require('jsonwebtoken');

// node cachemanager
var cacheManager = require('cache-manager');
// storage for the cachemanager
var fsStore = require('cache-manager-fs');
// initialize caching on disk
var diskCache = cacheManager.caching({
	store: fsStore,
	options: {
	 	ttl: 60*60 /* seconds */, 
	 	maxsize: 1000*1000*1000 /* max size in bytes on disk */, 
	 	path: 'cache', 
	 	preventfill: true
	}
});

var TOKEN_SECRET = config.TOKEN_SECRET;
var CPF_SALT = config.CPF_SALT;

var Ufba = require(cwd + '/app/lib/ufba/siac.js');
var Supac = require(cwd + '/app/lib/ufba/supac.js');

var models = require(cwd + '/app/models');

exports.login = function(req, res) {
	var formData        = req.body;

	var userData = {
		username: formData.cpf,
		password: formData.password,
	};

	var user = new Ufba(userData);

	user.login(function(logged, info) {
		if (!logged) {
			return res.json({
				success: false,
				message: 'CPF ou senha inválidos.',
				code: 2005
			});	
		}

		async.parallel({
			majorInformations: function(callback) {
				user.getMajorInformations(function(majorInformations) {
					callback(null, majorInformations);
				});
			},
			completedCourses: function(callback) {
				user.getCompletedCouses(function(completedCourses) {
					callback(null, completedCourses);
				});
			}
		}, function(err, results) {
			var majorInformations = results.majorInformations;
			var completedCourses = results.completedCourses;

			var cpfHash = md5(formData.cpf + CPF_SALT);

			models.user.findOrCreate({
				where: {
					cpfHash: cpfHash
				}, defaults: {						
					majorCode: majorInformations.majorCode,
					entryPeriod: completedCourses.entryPeriod,
					entryMethod: completedCourses.entryMethod,
					graduationPeriod: completedCourses.graduationPeriod, 
					graduationMethod: completedCourses.graduationMethod, 
					courseName: completedCourses.courseName, 
					curriculumPeriod: completedCourses.curriculumPeriod, 
					cr: completedCourses.cr, 
					lastVerificationSiac: models.sequelize.fn('NOW'), 
					lastVerificationSiav: models.sequelize.fn('NOW')
				}
			}).spread(function(user, created) {					
				var completedCoursesWithUserId = completedCourses.courses.map(function(completedCourse) {
					completedCourse.userId = user.id;
					return completedCourse;
				});

				var returnToken = function() {
					var token = jwt.sign({userId: user.id}, TOKEN_SECRET, {
			        	expiresIn: '30 minutes' // expires in 24 hours
			        });	

					res.json({
						success: true,
						message: '',
						token: token
					});	
				};

				// Create rows for completed courses if it's the user first time
				if (created) {
					models.completedCourse.bulkCreate(completedCoursesWithUserId).then(function() {
						return returnToken();
					});
				} else {
					return returnToken();
				}						
			});	
		});
		
	});
};

function getCachedCourses(majorCode, curriculumPeriod, cb) {
	var id = 'courses-' + majorCode + '-' + curriculumPeriod;
    diskCache.wrap(id, function (cacheCallback) {
		Supac.getCoursesByMajorCode(majorCode, curriculumPeriod, function (err, courses) {
			cacheCallback(err, courses);
		});	
	}, cb);
	
	
}

exports.me = function(req, res) {
	userId = req.decoded.userId;

	models.user.findById(userId, {
		include: [
			{ model: models.completedCourse }
		]
	}).then(function(user) {
		if (!user) {
			return res.json({
				success: false,
				message: 'Usuário extraido do token não é válido.',
				code: 2006
			});	
		}

		var majorCode = user.majorCode;
		var curriculumPeriod = user.curriculumPeriod.replace('.', '');

		getCachedCourses(majorCode, curriculumPeriod, function(err, courses) {
			res.json({
				success: true,
				message: '',
				courses: courses,
				completedCourses: user.completedCourses 
			});	
		});
	});
};