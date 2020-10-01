const http = require("http");

// 组合使用中间件
const compose = (middlewares) => {
	return (ctx) => {
        // 开始第一个中间件执行
		const dispatch = (i) => {
			const middleware = middlewares[i];
			try {
				Promise.resolve(middleware(ctx, dispatch.bind(null, i + 1)));
			} catch (err) {
				Promise.reject(err);
			}
		};
		return dispatch(0);
	};
};

class Koa2 {
	constructor() {
		this.middlewares = [];
	}

	// 注册中间件
	use(fn) {
		this.middlewares.push(fn);
		return this;
	}

	createContext(req, res) {
		return {
			req,
			res,
		};
	}

	callback() {
        // 中间件的处理函数
		const handler = compose(this.middlewares);
		return (req, res) => {
			res.json = (data) => {
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify(data));
			};
			const ctx = this.createContext(req, res);
			handler(ctx);
		};
	}

	listen(...args) {
		const server = http.createServer(this.callback());
		server.listen(...args);
	}
}

module.exports = Koa2;
