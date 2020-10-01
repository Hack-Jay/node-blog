const http = require("http");
const serverHandler = require("../index");

const server = http.createServer(serverHandler);

server.listen(8000, () => console.log("server is running at port 8000"));
