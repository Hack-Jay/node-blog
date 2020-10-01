const router = require("koa-router")();
const user = require("../controller/user");
const { formatRes } = require("../models/index");

router.prefix("/user");

router.get("/login", async function (ctx, next) {
	const { username, password } = ctx.query;
	const data = await user.login(username, password);
	if (data.username) {
		// 设置 session
		ctx.session.username = data.username;
		ctx.session.realname = data.realname;

		console.log("login success", data.username);
		ctx.body = formatRes(200, "success", data);
		return;
	}
	console.error("no login");
	ctx.body = formatRes(401, "no login", data);
});

router.get("/bar", function (ctx, next) {
	ctx.body = "this is a users/bar response";
});

module.exports = router;
