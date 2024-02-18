const sequelizeLogger = require("sequelize-log-syntax-colors");
const options = {
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "hamdan1234",
  database: "template-api",
  define: {
    underscored: true,
  },
  sync: {
    force: !!process.env.MYSQL_DB_SYNC,
  },
};

if (process.env.MYSQL_DB_LOGGING === false) {
  options.logging = process.env.MYSQL_DB_LOGGING;
} else {
  options.logging = function (text) {
    // eslint-disable-next-line
    console.log(sequelizeLogger.default(text));
  };
  options.benchmark = true;
  options.logQueryParameters = true;
}

module.exports = options;
