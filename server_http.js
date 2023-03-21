var http = require("http");

function hello(req, res) {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.end("<h1>안녕 Nodejs 세계!</h1>");
  }
  if (req.url === "/home") {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.end("<h1>홈</h1>");
  }
  if (req.url === "/prodile") {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.end("<h1>프로필</h1>");
  }
  console.log(req.url);
}

const server = http.createServer(hello);
server.listen(3000, function () {
  console.log("http://localhost:3000");
});
