let SQL_CONFIG;
let REDIS_CONFIG;

if (process.env.NODE_ENV === "dev") {
	SQL_CONFIG = {
		host: "localhost",
		user: "root",
		password: "123456",
		port: "3306",
		database: "blog",
	};
	REDIS_CONFIG = {
		port: 6379,
		host: "127.0.0.1",
	};
} else {
	SQL_CONFIG = {
		host: "localhost",
		user: "root",
		password: "123456",
		port: "3306",
		database: "blog",
	};
	REDIS_CONFIG = {
		port: 6379,
		host: "127.0.0.1",
	};
}

module.exports = {
	SQL_CONFIG,
	REDIS_CONFIG,
};
