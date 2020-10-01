// 格式化输出
const formatRes = (code = 200, msg = "", data = {}) => {
	return {
		code,
		msg,
		data,
	};
};

module.exports = { formatRes };
