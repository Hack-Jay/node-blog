const { exec, escape } = require("../db/mysql");
const { genPassword } = require("../utils/cryp");
// xss

class User {
	constructor() {}

	async login(username, password) {
		username = escape(username);

		// 密码加密
		password = genPassword(password);
		password = escape(password);

		let sql = `select username, realname  from users where username=${username} and password=${password}`;

		const rows = await exec(sql);
		return rows[0] || {};
	}
}

module.exports = new User();