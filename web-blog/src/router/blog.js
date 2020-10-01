const { formatRes } = require("../models/index");

const blog = require("../controller/blog");

const loginCheck = (req) => {
	if (!req.session.username) {
		return Promise.resolve(formatRes(401, "no login"));
	}
};

const handleBlogRouter = function (req, res) {
	const method = req.method;
	const { query, path } = req;
	const { id } = req.query;
	// 列表
	if (method === "GET" && path === "/blog/list") {
		const { author, keywords } = req.query;
		const result = blog.getList(author, keywords);
		return result.then((res) => {
			return formatRes(200, "", res);
		});
	}

	// 详情
	if (method === "GET" && path === "/blog/detail") {
		const result = blog.getDetail(id);
		return result.then((res) => {
			return formatRes(200, "", res[0]);
		});
	}

	if (method === "POST" && path === "/blog/new") {
		const loginCheckResult = loginCheck();
		if (loginCheckResult) {
			return loginCheckResult;
		}
		req.body.author = req.session.username;

		const result = blog.newBlog(req.body);
		return result.then((res) => {
			return formatRes(200, "", { id: res.insertId });
		});
	}

	// 更新博客
	if (method === "POST" && path === "/blog/update") {
		const loginCheckResult = loginCheck();
		if (loginCheckResult) {
			return loginCheckResult;
		}

		const result = blog.updateBlog(id, req.body);
		return result.then((res) => {
			if (res.affectedRows > 0) {
				return formatRes(200, "success");
			}
			return formatRes(400, "error");
		});
	}

	// 删除博客
	if (method === "POST" && path === "/blog/del") {
		const loginCheckResult = loginCheck();
		if (loginCheckResult) {
			return loginCheckResult;
		}
		req.body.author = req.session.username;

		const result = blog.delBlog(id, req.body.author);
		return result.then((res) => {
			if (res.affectedRows > 0) {
				return formatRes(200, "success");
			}
			return formatRes(400, "error");
		});
	}
};

module.exports = handleBlogRouter;
