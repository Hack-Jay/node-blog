const express = require("express");
const router = express.Router();
const { formatRes } = require("../models/index");
const blog = require("../controller/blog");

/* GET home page. */
router.get("/list", function (req, res, next) {
	const { author, keywords } = req.query;
	const result = blog.getList(author, keywords);
	return result.then((data) => {
		res.json(formatRes(200, "", data));
	});
});

router.get('/session-test', (req, res, next) => {
    const session = req.session
    if (session.viewNum == null) {
        session.viewNum = 0
    }
    session.viewNum++

    res.json({
        viewNum: session.viewNum
    })
})

module.exports = router;
