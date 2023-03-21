const http = require("http");
const express = require("express");
const app = express();

app.set("port", 3000);
app.set("views", __dirname + "/views"); // prefix - 경로
app.set("view engine", "ejs"); // suffix - 확장자

app.use(express.static(__dirname + "/public"));

var carList = [
  { seq: 1, name: "SONATA", price: 3500, company: "HYUNDAI", year: 2021 },
  { seq: 2, name: "GRANDEUR", price: 4500, company: "HYUNDAI", year: 2022 },
  { seq: 3, name: "S90", price: 7500, company: "VOLVO", year: 2020 },
  { seq: 4, name: "740i", price: 15000, company: "BMW", year: 2021 },
];

// req - request (요청)
// res - response (응답)
app.get("/", (req, res) => {
  console.dir(req);
  // view engine 등록(app.set)해야 사용 가능하다.
  req.app.render("car_list", { title: "중고차 목록2", carList: carList }, (err, htmlData) => {
    if (err != null) {
      throw err;
    }
    res.end(htmlData);
  });
});

const server = http.createServer(app);
server.listen(app.get("port"), () => {
  console.log(`server listening on port ${app.get("port")}`);
});
