const http = require("http");

class Express {
	constructor() {
		this.routes = { all: [], get: [], post: [] };
	}

	register(path, ...args) {
		const info = {};
		if (typeof path === "string") {
			info.path = path;
			info.stack = args;
		} else {
			info.path = "/";
			info.stack = [path, ...args];
		}
		return info;
	}

	use() {
		const info = this.register.apply(this, arguments);
		this.routes.all.push(info);
	}

	get() {
		const info = this.register.apply(this, arguments);
		this.routes.get.push(info);
	}

	post() {
		const info = this.register.apply(this, arguments);
		this.routes.post.push(info);
	}

	match(url, method) {
		let stack = [];
		if (url === "/favicon.ico") {
			return stack;
		}
		let currentRoute = [];
		currentRoute = currentRoute.concat(this.routes.all);
		currentRoute = currentRoute.concat(this.routes[method]);
		currentRoute.forEach((routeInfo) => {
			if (url.indexOf(routeInfo.path) === 0) {
				stack = stack.concat(routeInfo.stack);
			}
		});
		return stack;
	}

	handle(req, res, stack) {
		const next = () => {
			// 拿到第一个中间件函数
			const middleware = stack.shift();
			// 执行中间件
			if (middleware) {
				middleware(req, res, next);
			}
		};
		next();
	}

	callback() {
		// 支持res.json({a: 1})写法
		return (req, res) => {
			res.json = (data) => {
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify(data));
			};

			const url = req.url;
			const method = req.method.toLowerCase();
			// 开始处理serverHander,
			// match 匹配需要处理的中间件，返回的是需要处理的中间件函数列表
			// handle 处理中间件next机制
			const resultList = this.match(url, method);
			this.handle(req, res, resultList);
		};
	}

	listen(...args) {
		const server = http.createServer(this.callback());
		server.listen(...args);
	}
}

module.exports = () => new Express();
