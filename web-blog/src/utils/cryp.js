const crypto = require("crypto");

const secret = "adqwwqdfqd";

function md5(content) {
	let md5 = crypto.createHash("md5");
	return md5.update(content).digest("hex");
}

function genPassword(password) {
	const str = `password=${password}&key=${secret}`;
	return md5(str);
}

module.exports = {
	genPassword,
};
