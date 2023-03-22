const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const server = http.createServer(app);
const router = express.Router();
const bodyParser = require("body-parser");

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Design List 데이터 배열
let designList = [
  { seq: 01, title: "UX Design", client: "Naver", done: false },
  { seq: 02, title: "UI Design", client: "kakao", done: false },
  { seq: 03, title: "BX Design", client: "Samsung", done: true },
  { seq: 04, title: "Video Design", client: "LG", done: false },
  { seq: 05, title: "Web Design", client: "Doosan", done: false },
];
let sequence = 06;

// Design list forwards

// ---------- 리스트 메인(get) ------------------------------
router.route("/design").get((req, res) => {
  console.log("GET - /design");
  req.app.render("designList/List", { designList }, (err, html) => {
    if (err) throw err;
    res.end(html);
  });
});

// ---------- 리스트 메인(post) ------------------------------
router.route("/design").post((req, res) => {
  console.log("POST - /design");
  res.redirect("/design");
});

// ---------- 상세보기 ------------------------------
router.route("/design/detail").get((req, res) => {
  console.log("GET - /design/Detail");
  let seq = Number(req.query.seq);
  let findIdx = -1;
  let item = null;
  for (let i = 0; i < designList.length; i++) {
    if (designList[i].seq == seq) {
      findIdx = i;
      item = designList[i];
    }
  }
  req.app.render("designList/Detail", { item: item }, (err, html) => {
    if (err) throw err;
    res.end(html);
  });
});

// ---------- 폼 양식(get) ------------------------------
router.route("/design/form").get((req, res) => {
  console.log("GET - /design/form");
  req.app.render("designList/Form", {}, (err, html) => {
    if (err) throw err;
    res.end(html);
  });
});

// ---------- 폼 양식(post) ------------------------------
router.route("/design/form").post((req, res) => {
  console.log("POST - /design/form");
  console.log("req.body >>>", req.body);
  let title = req.body.title;
  let client = req.body.client;
  designList.push({ seq: sequence++, title: title, client: client, done: false });
  res.redirect("/design");
});

// ---------- 수정하기(get) ------------------------------
router.route("/design/modify").get((req, res) => {
  console.log("GET - /design/modify");
  let seq = Number(req.query.seq);
  let item = null;
  for (let i = 0; i < designList.length; i++) {
    if (designList[i].seq == seq) {
      findIdx = i;
      item = designList[i];
    }
  }
  req.app.render("designList/Modify", { item: item }, (err, html) => {
    if (err) throw err;
    res.end(html);
  });
});

// ---------- 수정하기(post) ------------------------------
router.route("/design/modify").post((req, res) => {
  var newDesign = req.body;
  console.log("new design >>>>> ", req.body);
  let seq = Number(req.body.seq);
  console.log("seq >>>>> ", seq);
  let findIdx = -1;
  for (let i = 0; i < designList.length; i++) {
    if (designList[i].seq == seq) {
      findIdx = i;
    }
  }
  if (findIdx != -1) {
    designList[findIdx] = newDesign;
  }
  console.log(designList);
  res.redirect("/design/detail?seq=" + seq);
});

// ---------- 리스트 삭제 ------------------------------
router.route("/design/delete").get((req, res) => {
  console.log("GET - /design/delete");
  let seq = Number(req.query.seq);
  let findIdx = -1;
  for (let i = 0; i < designList.length; i++) {
    if (designList[i].seq == seq) {
      findIdx = i;
    }
  }
  designList.splice(findIdx, 1);
  res.redirect("/design");
});

// test list forwards
router.route("/").get((req, res) => {
  console.log("GET - / 호출 됨");
  req.app.render("diesign/diesng", {}, (err, html) => {
    if (err) throw err;
    res.end(html);
  });
});

// router 미들웨어 등록
app.use("/", router);

// Server 실행
server.listen(app.get("port"), () => {
  console.log("Server listening on port " + app.get("port"));
});
