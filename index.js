const express = require("express");
const http = require("http");
const cors = require("cors");
const fs = require("fs");

const app = new express();

const HTML_file_path = "/conimal";
const icon_file_path = "/icon";

app.use(cors());

app.use("/html", express.static(__dirname + HTML_file_path));
app.use("/icon", express.static(__dirname + icon_file_path));
app.listen(8778, () => console.log("server started!")); //listen 메서드 서버 시작, 콜백함수는 시작할 떄, 호출

