const http = require("http");

const compose = (middlewares) => {
	return (ctx) => {
		const dispatch = (i) => {
			const fn = middlewares[i];
			try {
				return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1))); // dispatch.bind(null, i + 1)下一个中间件
			} catch (e) {
				return Promise.reject(e);
			}
		};
		return dispatch(0);
	};
};

class Koa2 {
	constructor() {
		this.middlewares = [];
	}

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
		const fn = compose(this.middlewares);

		return (req, res) => {
			const ctx = this.createContext(req, res);
			return fn(ctx);
		};
	}

	listen(...args) {
		const server = http.createServer(this.callback());
		server.listen(...args);
	}
}

module.exports = Koa2;
