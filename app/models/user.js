module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', {
		cpfHash: DataTypes.STRING,
		majorCode: DataTypes.STRING,
		entryPeriod: DataTypes.STRING,
		entryMethod: DataTypes.STRING,
		graduationPeriod: DataTypes.STRING,
		graduationMethod: DataTypes.STRING,
		courseName: DataTypes.STRING,
		curriculumPeriod: DataTypes.STRING,
		cr: DataTypes.STRING,
		lastVerificationSiac: DataTypes.DATE,
		lastVerificationSiav: DataTypes.DATE
	}, {
        classMethods: {
            associate: function(models) {
                user.hasMany(models.completedCourse);
            }
        }
    });

	return user;
}