const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const server = http.createServer(app);
const router = express.Router();
// npm i -S body-parser
const bodyParser = require("body-parser");

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", express.static(path.join(__dirname, "public"))); // 절대경로
app.use(bodyParser.json()); //json data 전송
app.use(bodyParser.urlencoded({ extended: true }));

// Todo List 임시 데이터 배열
let todoList = [
  //seq = 시퀸스
  { seq: 101, title: "청소하기", user: "user01", done: false },
  { seq: 102, title: "빨래하기", user: "user01", done: true },
  { seq: 103, title: "공부하기", user: "user01", done: false },
  { seq: 104, title: "숙제하기", user: "user01", done: false },
];
let sequence = 105;

// Todo List forwards
router.route("/todo").get((req, res) => {
  console.log("GET - /todo");
  // render(파일이름, EJS페이지로 전달될 객체(데이터), EJS에서 처리된 결과)
  req.app.render("todoList/List", { todoList }, (err, html) => {
    if (err) throw err;
    res.end(html);
  });
});

router.route("/todo").post((req, res) => {
  console.log("POST - /todo");
  // 정보 입력 후 목록으로 페이지 전환
  res.redirect("/todo");
});

router.route("/todo/detail").get((req, res) => {
  console.log("GET - /todo/detail");
  //   console.log("seq =>", req.query.seq);
  // --- 의사코드(의사코딩) - 한국어로 먼저 코딩한다. 논리적으로
  // --- 요구분석 한 것을 어떻게 구현 할지 논리적으로 정리하는 것
  // findIndex()나 indexOf등으로 배열의 요소를 검색
  // 1, 요청 피라미터를 전달 받기 ->   console.log("seq =>", req.query.seq);
  let seq = Number(req.query.seq);
  // 2. 배열의 요소를 검색 (findIndex()나 indexOf()등으로)
  // 2-1. findIndex를 모를 떄는 검색 알고리즘을 이용한다.
  let findIdx = -1; // index는 -1이 없다.
  let item = null;
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].seq == seq) {
      findIdx = i;
      item = todoList[i];
    }
  }
  // 3. 검색된 요소를 Detail 넘겨준다. (render() 인자 or JSON 형식)
  // 4. 뷰페이지에서 검색 된 데이터 출력
  req.app.render("todoList/Detail", { item: item }, (err, html) => {
    if (err) throw err;
    res.end(html);
  });
  //   req.app.render("todoList/Detail", {}, (err, html) => {
  //     if (err) throw err;
  //     res.end(html);
  //   });
});
router.route("/todo/form").get((req, res) => {
  console.log("GET - /todo/form");
  req.app.render("todoList/Form", {}, (err, html) => {
    if (err) throw err;
    res.end(html);
  });
});
router.route("/todo/form").post((req, res) => {
  console.log("POST - /todo/form");
  // 중요해요! post로 전달되는 파라미터는 body에 있다. body data는 bodyParser 이용.
  // bodyParser 사용하기 위해서는 미들웨어에 등록 해야 한다.
  // 1.전잘 된 요청 파라미드를 받아온다.
  console.log("req.body >>>", req.body); // 객체를 출력 해 본다.
  let title = req.body.todo;
  let user = req.body.user;
  // 2. todoList에 추가한다.
  todoList.push({ seq: sequence++, title: title, user: user, done: false });
  // 3. 목록으로 페이지 전환

  res.redirect("/todo"); // 새로고침(리다이렉트)
});

router.route("/todo/modify").get((req, res) => {
  console.log("GET - /todo/modify");
  let seq = Number(req.query.seq);
  let item = null;
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].seq == seq) {
      findIdx = i;
      item = todoList[i];
    }
  }
  req.app.render("todoList/Modify", { item: item }, (err, html) => {
    if (err) throw err;
    res.end(html);
  });
});

router.route("/todo/modify").post((req, res) => {
  // 1. 파라미터 전송 받기
  var newTodo = req.body;
  console.log("new todo >>>>> ", req.body);
  let seq = Number(req.body.seq);
  console.log("seq >>>>> ", seq);
  // 2. 수정 할 item 찾기
  let findIdx = -1;
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].seq == seq) {
      findIdx = i;
    }
  }
  // 3. 수정
  if (findIdx != -1) {
    // newTodo.seq = Number(newTodo.seq);
    // newTodo.done = newTodo.done == "true";
    todoList[findIdx] = newTodo;
  }
  console.log(todoList);

  // 4. 리다이렉트
  res.redirect("/todo/detail?seq=" + seq);
});
router.route("/todo/delete").get((req, res) => {
  console.log("GET - /todo/delete");
  // delete 처리 후 list로 전환된다.
  // spliice()로 삭제 가능.
  let seq = Number(req.query.seq);
  // 2. 수정 할 item 찾기
  let findIdx = -1;
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].seq == seq) {
      findIdx = i;
    }
  }
  // 3. 삭제
  todoList.splice(findIdx, 1); // 삭제 완료
  // 4. 리다이렉트
  res.redirect("/todo");
});

// test design list forwards
router.route("/deisign").get((req, res) => {
  // 뷰 렌더링 테스트
  // view engine 셋팅 필수
  console.log("GET - / 호출 됨");
  req.app.render("car/car", {}, (err, html) => {
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
