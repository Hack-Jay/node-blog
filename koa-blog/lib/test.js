const Koa = require("./index");
const app = new Koa();

// logger
// await next指向下一个中间件，是执行下一个中间件，完成后再同步执行后面的代码
app.use(async (ctx, next) => {
	await next();
	const rt = ctx["X-Response-Time"];
	console.log(`${ctx.req.method} ${ctx.req.url} - ${rt}`);
	console.log('1 end')
});

// x-response-time
app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx["X-Response-Time"] = `${ms}ms`;
	console.log('2 end')
});

// response
app.use(async (ctx) => {
	ctx.res.end("This is like koa2");
});

app.listen(8000, () => console.log("server is running at port 8000"));
