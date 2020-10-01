const mysql = require("mysql");
const { SQL_CONFIG } = require("../config/db");

const con = mysql.createConnection(SQL_CONFIG);

con.connect();

function exec(sql) {
	return new Promise((resolve, reject) => {
		con.query(sql, (err, data) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(data);
		});
	});
}

module.exports = {
	exec,
	escape: mysql.escape,
};
