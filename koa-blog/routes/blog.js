const router = require("koa-router")();
const blog = require("../controller/blog");
const { formatRes } = require("../models/index");

router.prefix("/blog");

// 只修改get list路由，其他自行增加
router.get("/list", async function (ctx, next) {
	const { author, keywords } = ctx.query;
	const result = await blog.getList(author, keywords);
	ctx.body = formatRes(200, "", result);
});

module.exports = router;
