const router = require("koa-router")();

router.get("/", async (ctx, next) => {
	await ctx.render("index", {
		title: "Hello Koa 2!",
	});
});

router.get("/string", async (ctx, next) => {
	ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
	ctx.body = {
		title: "koa2 json",
	};
});

router.get("/view", async (ctx, next) => {
	if (ctx.session.view == null) {
		ctx.session.view = 0;
	}
	ctx.session.view++;
	ctx.body = {
		view: ctx.session.view,
	};
});

module.exports = router;
