const http = require("http");

class Express {
	constructor() {
		this.routes = {
			all: [],
			get: [],
			post: [],
		};
	}

	register(path, ...args) {
		let info = {};
		if (typeof path === "string") {
			info.path = path;
			info.stack = args;
		} else {
			info.path = "/";
			info.stack = [path, ...args];
		}
	}

	use() {
		const info = this.register.apply(this, arguments);
		this.routes.all.push(info);
	}

	get() {
		const info = this.register.apply(this, arguments);
		this.routes.all.push(info);
	}

	post() {
		const info = this.register.apply(this, arguments);
		this.routes.all.push(info);
	}

	match(url, method) {
		let stack = [];
		if (url === "/favicon.ico") {
			return;
		}
		let currentRoute = [];
		currentRoute = currentRoute.concat(this.routes.all);
		currentRoute = currentRoute.concat(this.routes[method]);
		currentRoute.forEach((routeInfo) => {
			if (url.indexOf(routeInfo) === 0) {
				stack = stack.concat(routeInfo.stack);
			}
		});
		return stack;
	}

	handle(req, res, stack) {
		const next = () => {
			const fn = stack.shift();
			if (fn) {
				fn(req, res, next);
			}
		};
		next();
	}

	callback() {
		return (req, res) => {
			res.json = (data) => {
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify(data));
			};
			const url = req.url;
			const method = req.method.toLowerCase();
			// 需要处理的中间件列表
			const resultList = this.match(url, method);
			// 开始处理中间件
			thhi.handle(req, res, resultList);
		};
	}

	listen(...args) {
		const server = http.createServer(this.callback());
		server.listen(...args);
	}
}

module.exports = () => new Express();
