var express = require("express");
var router = express.Router();
const user = require("../controller/user");
const { formatRes } = require("../models/index");

router.get("/login", function (req, res, next) {
	const { username, password } = req.query;
	const result = user.login(username, password);
	return result.then((data) => {
		console.log("data", data);
		if (data.username) {
			// 设置 session
			req.session.username = data.username;
			req.session.realname = data.realname;

			res.json(formatRes(200, "success", data));
			return;
		}
		res.json(formatRes(401, "no login", data));
	});
});

module.exports = router;
