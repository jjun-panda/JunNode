const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const path = require("path");
const router = express.Router();

const carList = [
  { seq: 01, name: "아이스 카페 아메리카노", nameEg: "HYUNDAI", price: 4500, typeCoffer: 2020 },
  { seq: 02, name: "카페 아메리카노", nameEg: "KIA", price: 4500, typeCoffer: 2018 },
  { seq: 03, name: "봄 딸기 라떼", nameEg: "르노", price: 6900, typeCoffer: 2017 },
  { seq: 04, name: "카페 라떼", nameEg: "제네시스", price: 5000, typeCoffer: 2017 },
];
let sequence = 05;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);

app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get("/test/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.writev("GET - /test/junseok<br />");
  res.end(JSON.stringify(req.url));
});

// ---------- 리스트 메인(get) ------------------------------
router.route("/car/list").get((req, res) => {
  // 나중에 db에서 carList 가져오는 로직이 들어갈 예정
  // 배열로 cartList 임시
  req.app.render("car/list", { carList: carList }, (err, html) => {
    if (err) throw err;
    res.end(html);
  });
});

// ---------- 상세보기 ------------------------------
router.route("/car/input").post((req, res) => {
  // 입력 처리 (bodyParser미들웨어 필수)
  var newCar = req.body;
  newCar.seq = sequence++;
  carList.push(newCar);
  // 목록으로 리다이렉트
  res.redirect("/car/list");
});

// ---------- 상세보기 및 수정 페이지 ------------------------------
router.route("/car/modify/:seq").get((req, res) => {
  var seq = req.params.seq;
  var idx = carList.findIndex(function (carItem) {
    return carItem.seq == seq;
  });
  if (idx != -1) {
    //  불러오는것은 'car' (기존 item역할과 동일함)
    req.app.render("car/modify", { car: carList[idx] }, (err, html) => {
      if (err) throw err;
      res.end(html);
    });
  } else {
    res.redirect("/car/list");
  }
});

// ---------- 수정 기능 ------------------------------
router.route("/car/modify").post((req, res) => {
  var modifyCar = req.body;
  var seq = modifyCar.seq;
  var idx = carList.findIndex(function (carItem) {
    return carItem.seq == seq;
  });
  if (idx != -1) {
    // 있으면 수정
    carList[idx] = modifyCar;
  }
  res.redirect("/car/list");
});

// ---------- 삭제 ------------------------------
router.route("/car/delete/:seq").get((req, res) => {
  var seq = req.params.seq;
  var idx = carList.findIndex(function (carItem) {
    return carItem.seq == seq;
  });
  if (idx != -1) carList.splice(idx, 1);
  res.redirect("/car/list");
});

// 서버 실행 전에 미들웨어 등록
app.use("/", router);
server.listen(app.get("port"), () => {
  console.log("listening on port " + app.get("port"));
});
