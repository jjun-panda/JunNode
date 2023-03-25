const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const path = require("path");
const router = express.Router();

const carList = [
  { seq: 01, name: "SONATA", price: 2000, company: "HYUNDAI", year: 2020 },
  { seq: 02, name: "K7", price: 3700, company: "KIA", year: 2018 },
  { seq: 03, name: "SM6", price: 1800, company: "르노", year: 2017 },
  { seq: 04, name: "G80", price: 5000, company: "제니시스", year: 2017 },
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);

app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get("/test/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("GET - /test/junseok<br/>");
  res.end(JSON.stringify(req.url));
});

router.route("/car/list").get((req, res) => {
  // 나중에 db에서 carList 가져오는 로직이 들어가게 된다.
  // 지금은 배열로 carList를 임시로 만든다.
  req.app.render("car/list", { carList }, (err, html) => {
    if (err) throw err;
    res.end(html);
  });
});

router.route("/car/input").post((req, res) => {
  // 입력 처리 (bodyParser미들웨어 필수)
  var newCar = req.body;
  newCar.seq = sequence++;
  carList.push(newCar);
  // 목록으로 리다이렉트
  res.redirect("/car/list");
});

// 상세보기 및 수정 페이지로 이동
router.route("/car/modify/:seq").get((req, res) => {
  var seq = req.params.seq;
  var idx = carList.findIndex(function (carItem) {
    return carItem.seq == seq;
  });
  if (idx != -1) {
    req.app.render("car/modify", { car: carList[idx] }, (err, html) => {
      if (err) throw err;
      res.end(html);
    });
  } else {
    res.redirect("/car/list");
  }
});
// 수정 기능
router.route("/car/modify/:seq").post((req, res) => {
  var modifyCar = req.body;
  var seq = modifyCar.seq;
  var idx = carList.findIndex(function (carItem) {
    return carItem.seq == seq;
  });
  if (idx != -1) {
    // 있으면 수정
    carList[idex] = modifyCar;
  }
  res.redirect("/car/list");
});

router.route("car/delete/:seq").get((req, res) => {
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
