var dotenv = require('dotenv').config({silent: true});

var config = {};

config.PORT = (process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000);
config.IP = (process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');

config.TOKEN_SECRET = process.env.TOKEN_SECRET;
config.CPF_SALT = process.env.CPF_SALT;

config.POSTGRES_DB_URL = (process.env.OPENSHIFT_MYSQL_DB_URL || process.env.POSTGRES_DB_URL);

module.exports = config;