const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const server = http.createServer(app);
const router = express.Router();

const coffeeList = [
  { seq: 01, nameKr: "아이스 카페 아메리카노", nameEg: "Iced Caffe Americano", price: 4500, typeCoffee: "hot" },
  { seq: 02, nameKr: "카페 아메리카노", nameEg: "Caffe Americano", price: 4500, typeCoffee: "hot/ice" },
  { seq: 03, nameKr: "봄 딸기 라떼", nameEg: "Spring Strawberry Milk", price: 6900, typeCoffee: "hot/ice" },
  { seq: 04, nameKr: "카페 라떼", nameEg: "Caffe Latte", price: 5000, typeCoffee: "hot/ice" },
];
let sequence = 05;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 8000);

app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- 리스트 메인(get) ------------------------------
router.route("/coffee/list").get((req, res) => {
  req.app.render("coffee/list", { coffeeList: coffeeList }, (err, html) => {
    if (err) throw err;
    res.end(html);
  });
});

// ---------- 상세보기 ------------------------------
router.route("/coffee/input").post((req, res) => {
  // console.log("req.body >>>", req.body);
  var newCoffer = req.body;
  newCoffer.seq = sequence++;
  coffeeList.push(newCoffer);
  res.redirect("/coffee/list");
});

// ---------- 상세보기 및 수정 페이지 ------------------------------
router.route("/coffee/modify/:seq").get((req, res) => {
  var seq = req.params.seq;
  var idx = coffeeList.findIndex(function (coffeeItem) {
    return coffeeItem.seq == seq;
  });
  if (idx != -1) {
    req.app.render("coffee/modify", { coffee: coffeeList[idx] }, (err, html) => {
      if (err) throw err;
      res.end(html);
    });
  } else {
    res.redirect("/coffee/list");
  }
});

// ---------- 수정 기능 ------------------------------
router.route("/coffee/modify").post((req, res) => {
  console.log("req.body >>>", req.body);

  var modifyCoffer = req.body;
  var seq = modifyCoffer.seq;
  var idx = coffeeList.findIndex(function (coffeeItem) {
    return coffeeItem.seq == seq;
  });
  if (idx != -1) {
    coffeeList[idx] = modifyCoffer;
  }
  res.redirect("/coffee/list");
});

// ---------- 삭제 ------------------------------
router.route("/coffee/delete/:seq").get((req, res) => {
  var seq = req.params.seq;
  var idx = coffeeList.findIndex(function (coffeeItem) {
    return coffeeItem.seq == seq;
  });
  if (idx != -1) coffeeList.splice(idx, 1);
  res.redirect("/coffee/list");
});

// 서버 실행 전에 미들웨어 등록
app.use("/", router);
server.listen(app.get("port"), () => {
  console.log("listening on port " + app.get("port"));
});
