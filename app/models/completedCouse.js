module.exports = function(sequelize, DataTypes) {
	var completedCourse = sequelize.define('completedCourse', {
		acronym: DataTypes.STRING,
        name: DataTypes.STRING,
        ch: DataTypes.STRING,
        nt: DataTypes.STRING,
        score: DataTypes.STRING,
        status: DataTypes.STRING,
        period: DataTypes.STRING,
        professor: DataTypes.STRING,
        userId: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                completedCourse.belongsTo(models.user, { foreignKey: 'userId' });
            }
        }
    });

	return completedCourse;
}