const http = require("http");
const express = require("express");
const app = express();

//정적 페이지 서비스 폴더 설정
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  res.write("<h1>코딩사이트 | 메인</h1>");
  res.write("<p></p><a href ='/seb'>서브</a></p>");
  res.write("<p><a href ='/profile'>프로필</a></p>");
  res.write("<p><a href ='/gallery'>갤러리</a></p>");
  res.end(); //안해주면 무한루프 오류
});
app.get("/seb", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  res.write("<h1>코딩사이트 | 서브</h1>");
  res.write("<p></p><a href ='/'>메인</a></p>");
  res.write("<p><a href ='/profile'>프로필</a></p>");
  res.write("<p><a href ='/gallery'>갤러리</a></p>");
  res.end(); //안해주면 무한루프 오류
});
app.get("/profile", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  res.write("<h1>코딩사이트 | 프로필</h1>");
  res.write("<p></p><a href ='/'>메인</a></p>");
  res.write("<p><a href ='/seb'>서브</a></p>");
  res.write("<p><a href ='/gallery'>갤러리</a></p>");
  res.end(); //안해주면 무한루프 오류
});
app.get("/gallery", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  res.write("<h1>코딩사이트 | 갤러리</h1>");
  res.write("<a href ='/'>메인</a></p>");
  res.write("<a href ='/seb'>서브</a></p>");
  res.write("<a href ='/profile'>프로필</a></p>");
  res.end(); //안해주면 무한루프 오류
});

// http와 express를 결합하는 형태로 서비스
const server = http.createServer(app);
server.listen(3000, () => {
  console.log("Sever listening on port 3000");
});
