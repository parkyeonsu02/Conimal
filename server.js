import express from "express";
import path from "path";
import ejs from "ejs";
import cors from "cors";
import bodyParser from "body-parser";
import MysqlDb from "./config/MysqlDBConn.js";
import { request } from "http";


const app = express();
const port = 3000;
const __dirname = path.resolve();


MysqlDb.connect();

app.set("view engine", "ejs"); //ejs
app.set("views", "./conimal");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname));

//서버 시작시 뜨는 창. 메인
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/main.html');
})

//네비게이션
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/navigation.html');
})

//지도
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/map.html');
})

//유저정보 수정
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/user.html');
})

//동물정보 수정
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/myPage_edit_pet.html');
})

//게시판 처음
app.get("/notice", (req, res) => {
  let queryStatement = "select * from notice";

  MysqlDb.query(queryStatement, (err, rows) => {
    if (!err) {
      let noticeInfo = rows;

      if (!noticeInfo) {
        console.log("Err");
      } else {
        console.log(noticeInfo)
        res.render('notice.ejs', { noticeInfo });
      }
    }
  });

})

//글 선택
app.get('/content/:notice_id', (req, res) => {
  let queryStatement = "select * from notice where notice_id=?";
  let queryParams = [req.params.notice_id];

  MysqlDb.query(queryStatement, queryParams, (err, rows) => {
    if (!err) {
      let content = rows[0];
      console.log(content)
      if (!content) {
        console.log("Err");

      } else {
        res.render('notice_contents.ejs', { content });
      }
    } else {
      console.log(err)
    }
  });
})


//게시판 글쓰기
app.post('/post', (req, res) => {

  let { writer, title, content } = req.body;

  let queryStatement = "INSERT INTO notice (`writer`, `title`, `content`) VALUES (?, ?, ?);";

  let queryParams = [writer, title, content];

  MysqlDb.query(queryStatement, queryParams);

  let queryStatement2 = "select notice_id from notice where writer=? and title=?";
  let queryParams2 = [writer, title];

  MysqlDb.query(queryStatement2, queryParams2, (err, rows) => {
    if (!err) {
      let notice_id = rows[0];
      console.log(notice_id)
      res.redirect('/content/' + notice_id['notice_id'])
    }
  });



})

app.get('/postNotice/', (req, res) => {
  res.render('notice_entry.ejs');
})


//회원가입 페이지
app.post('/login', (req, res) => {

  let { id, PASSWORD_, user_name } = req.body;

  let queryStatement = "INSERT INTO login (`id`, `PASSWORD_`, `user_name`) VALUES (?, ?, ?);";

  let queryParams = [id, PASSWORD_, user_name];

  MysqlDb.query(queryStatement, queryParams);

  let queryStatement2 = "select * from login where id=? and PASSWORD_=?";
  let queryParams2 = [id, PASSWORD_];

  MysqlDb.query(queryStatement2, queryParams2, (err, rows) => {
    if (!err) {
      let notice_id = rows[0];
      console.log(id)
      res.redirect('/login_page') // /content/
    }
  });

})
//db에 정보 받기
app.get('/postLogin/', (req, res) => {
  res.render('login.ejs');
})



//로그인 페이지
app.get("/login_page", (req, res) => {
  let queryStatement = "select * from notice";

  MysqlDb.query(queryStatement, (err, rows) => {
    if (!err) {
      let loginInfo = rows;

      if (!loginInfo) {
        console.log("Err");
      } else {
        console.log(loginInfo)
        res.render('login_page.ejs', { loginInfo });
      }
    }
  });

})

//마이페이지 이동
app.get("/mypage", (req, res) => {
  let queryStatement = "select * from notice";

  MysqlDb.query(queryStatement, (err, rows) => {
    if (!err) {
      let Mypage = rows;

      if (!Mypage) {
        console.log("Err");
      } else {
        console.log(Mypage)
        res.render('mypage.ejs', { Mypage });
      }
    }
  });

})


//동물정보추가
app.post('/animal', (req, res) => {

  let { animal_id, animal_name, animal_age, animal_others } = req.body;

  let queryStatement = "INSERT INTO animal_info (`animal_id`, `animal_name`, `animal_age`, `animal_others`) VALUES (?, ?, ?, ?);";

  let queryParams = [animal_id, animal_name, animal_age, animal_others];

  MysqlDb.query(queryStatement, queryParams);

  let queryStatement2 = "select * from animal_info where animal_id=?";
  let queryParams2 = [animal_id];

  MysqlDb.query(queryStatement2, queryParams2, (err, rows) => {
    if (!err) {
      let animal_id = rows[0];
      console.log(animal_id)
      res.redirect('/mypage')
    }
  });

})
//db에 정보 받기
app.get('/postMypage/', (req, res) => {
  res.render('mypage.ejs');
})






app.listen(port, () => {
  console.log("server start!");
});
