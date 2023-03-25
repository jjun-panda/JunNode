const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const path = require("path");
const router = express.Router();

const eitList = [
  { seq: 01, name: "닭꼬치", price: 3500, company: "포장마차", year: 2023 },
  { seq: 02, name: "샤브샤브", price: 12000, company: "채선당", year: 2019 },
  { seq: 03, name: "소고기", price: 100000, company: "코스트코", year: 2020 },
  { seq: 04, name: "닭볶음", price: 35000, company: "강남역떡도리탕", year: 2023 },
];
let sequence = 05;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 9000);

app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get("/test/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("GET - /test/beomjoon<br/>");
  res.end(JSON.stringify(req.url));
});

router.route("/eit/list").get((req, res) => {
  // 나중에 db에서 carList 가져오는 로직이 들어가게 된다.
  // 지금은 배열로 carList를 임시로 만든다.
  req.app.render("eit/list", { eitList: eitList }, (err, html) => {
    if (err) throw err;
    res.end(html);
  });
});

router.route("/eit/input").post((req, res) => {
  // 입력 처리 (bodyParser미들웨어 필수)
  var newEit = req.body;
  newEit.seq = sequence++;
  eitList.push(newEit);
  // 목록으로 리다이렉트
  res.redirect("/Eit/list");
});
//상세보기 및 수정 페이지로 이동
router.route("/eit/modify/:seq").get((req, res) => {
  var seq = req.params.seq;
  var idx = eitList.findIndex(function (eitItem) {
    return eitItem.seq == seq;
  });

  if (idx != -1) {
    req.app.render("eit/modify", { eit: eitList[idx] }, (err, html) => {
      if (err) throw err;
      res.end(html);
    });
  } else {
    res.redirect("/eit/list");
  }
});
//  수정기능
router.route("/eit/modify").post((req, res) => {
  var modifyEit = req.body;
  var seq = modifyEit.seq;
  var idx = eitList.findIndex(function (eitItem) {
    return eitItem.seq == seq;
  });
  if (idx != -1) {
    //있으면 수정
    eitList[idx] = modifyEit;
  }
  res.redirect("/eit/list");
});

router.route("eit/delete/:seq").get((req, res) => {
  var seq = req.params.seq;
  var idx = eitList.findIndex(function (eitItem) {
    return eitItem.seq == seq;
  });
  if (idx != -1) eitList.splice(idx, 1);
  res.redirect("/eit/list");
});

// 서버 실행 전에 미들웨어 등록
app.use("/", router);
server.listen(app.get("port"), () => {
  console.log("listening on port " + app.get("port"));
});
