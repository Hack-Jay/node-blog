const { exec, escape } = require("../db/mysql");
const { genPassword } = require("../utils/cryp");
// xss

class User {
	constructor() {}

	login(username, password) {
		username = escape(username);

		// 密码加密
		password = genPassword(password);
		password = escape(password);

		let sql = `select username, realname  from users where username=${username} and password=${password}`;

		console.log("password", password, "sql", sql);
		return exec(sql).then((row) => {
			return row[0] || {};
		});
	}
}

module.exports = new User();
