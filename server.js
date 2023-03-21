const http = require("http");
const express = require("express");
const app = express();

app.set("port", 3000);
app.set("views", __dirname + "/views"); // prefix - 경로
app.set("view engine", "ejs"); // suffix - 확장자

app.use(express.static(__dirname + "/public"));

var designList = [
  { seq: 1, name: "UX", price: 3500, company: "SAMSUNG", year: 2023 },
  { seq: 2, name: "UI", price: 4500, company: "LG", year: 2021 },
  { seq: 3, name: "BX", price: 7500, company: "NAVER", year: 2012 },
  { seq: 4, name: "Video", price: 1500, company: "KAKAO", year: 2022 },
];

// req - request (요청)
// res - response (응답)
app.get("/", (req, res) => {
  console.dir(req);
  // view engine 등록(app.set)해야 사용 가능하다.
  req.app.render("design_list", { title: "디자인 목록2", designList: designList }, (err, htmlData) => {
    if (err != null) {
      throw err;
    }
    res.end(htmlData);
  });
});

const server = http.createServer(app);
server.listen(app.get("port"), () => {
  console.log(`Server listening on port ${app.get("port")}`);
});
