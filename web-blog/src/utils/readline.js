// 日志分析 Chrome占比
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const filename = path.join(__dirname, "../../logs/access.log");

const readStream = fs.createReadStream(filename);

const rl = readline.createInterface({
	input: readStream,
});

let num = 0;
let chromeNum = 0;

rl.on("line", (line) => {
	// console.log("line", line);
	if (!line) return;
	num++;
	if (line.indexOf("Chrome") > 0) chromeNum++;
});

rl.on("close", () => {
	console.log("chrome 占比", chromeNum / num);
});
