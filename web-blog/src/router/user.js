const { formatRes } = require("../models/index");

const user = require("../controller/user");
const { set } = require("../db/redis");

const setExpires = () => {
	let d = new Date();
	d.setTime(Date.now() + 24 * 60 * 60 * 1000);
	return d.toGMTString();
};

const handleUserRouter = function (req, res) {
	const method = req.method;
	const { query, path } = req;

	if (method === "GET" && path === "/user/login") {
		const { username, password } = req.query;
		return user.loginCheck(username, password).then((data) => {
			if (data.username) {
				req.session.username = data.username;
				req.session.realname = data.realname;
				set(req.sessionId, req.session)
				return formatRes(200, "success", data);
			}
			return formatRes(400, "error", data);
		});
	}
};

module.exports = handleUserRouter;
