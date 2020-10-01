const querystring = require("querystring");
const { set, get } = require("./src/db/redis");
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");
const { access } = require("./src/utils/log");

const getPostData = (req) => {
	// POST 请求的内容全部的都在请求体中，http.ServerRequest 并没有一个属性内容为请求体，原因是等待请求体传输可能是一件耗时的工作。
	// 比如上传文件，而很多时候我们可能并不需要理会请求体的内容，恶意的POST请求会大大消耗服务器的资源，
	// 所以 node.js 默认是不会解析请求体的，当你需要的时候，需要手动来做。
	return new Promise((resolve, reject) => {
		if (
			req.method !== "POST" ||
			req.headers["content-type"] !== "application/json"
		) {
			resolve({});
			return;
		}
		let postData = "";
		req.on("data", (chunk) => {
			postData += chunk.toString();
		});

		req.on("end", () => {
			if (!postData) {
				resolve({});
				return;
			}
			resolve(JSON.parse(postData));
		});
	});
};

const setExpires = () => {
	let d = new Date();
	d.setTime(Date.now() + 24 * 60 * 60 * 1000);
	return d.toGMTString();
};

const serverHandler = function (req, res) {
	// write log
	access(
		`${req.method} -- ${req.url} -- ${
			req.headers["user-agent"]
		} -- ${Date.now()}}`
	);

	const query = querystring.parse(req.url.split("?")[1]);
	const path = req.url.split("?")[0];
	req.path = path;
	req.query = query;

	res.setHeader("Content-Type", "application/json");

	// 解析cookie
	req.cookie = {};
	const cookieStr = req.headers.cookie || "";
	cookieStr.split(";").forEach((item) => {
		if (!item) {
			return;
		}
		let arr = item.split("=");
		let key = arr[0].trim();
		let value = arr[1].trim();
		req.cookie[key] = value;
	});

	// parse session
	let { userId } = req.cookie;

	// let needSession = false;
	// if (userId) {
	// 	if (!SESSION_DATA[userId]) {
	// 		SESSION_DATA[userId] = {};
	// 	}
	// } else {
	// 	needSession = true;
	// 	userId = `${Date.now()}_${Math.random()}`;
	// 	SESSION_DATA[userId] = {};
	// }
	// // 每个req都是一个http请求，是独立的
	// req.session = SESSION_DATA[userId];

	let needSession = false;
	if (!userId) {
		needSession = true;
		userId = `${Date.now()}_${Math.random()}`;
		set(userId, {});
	}
	// get session
	req.sessionId = userId;
	get(req.sessionId)
		.then((sessionData) => {
			if (sessionData === null) {
				set(req.sessionId, {});
				req.session = {};
			} else {
				req.session = sessionData;
			}
			console.log("req.session", req.session);
			return getPostData(req);
		})
		.then((postData) => {
			req.body = postData;
			const blogRes = handleBlogRouter(req, res);

			if (blogRes) {
				blogRes.then((data) => {
					if (needSession) {
						res.setHeader(
							"Set-Cookie",
							`userId=${userId}; path=/; httpOnly; expires=${setExpires()}`
						);
					}
					res.end(JSON.stringify(data));
				});
				return;
			}

			const userRes = handleUserRouter(req, res);
			if (userRes) {
				userRes.then((data) => {
					if (needSession) {
						res.setHeader(
							"Set-Cookie",
							`userId=${userId}; path=/; httpOnly; expires=${setExpires()}`
						);
					}
					res.end(JSON.stringify(data));
				});
				return;
			}

			res.writeHead(404, { "Content-Type": "text/plain" });
			res.write("404 NOT FOUND \n");
			res.end();
		});
};

module.exports = serverHandler;
