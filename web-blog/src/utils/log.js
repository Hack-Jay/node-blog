const fs = require("fs");
const path = require("path");

const accessFilelName = path.join(__dirname, "../../logs/access.log");

const accessWriteStream = fs.createWriteStream(accessFilelName, {
	flags: "a",
});

const writeLog = (writeStream, log) => {
	writeStream.write(log + "\n", "UTF8");
};

// logs: 写入的日志
const access = (logs) => {
	writeLog(accessWriteStream, logs);
};

module.exports = {
	access,
};
