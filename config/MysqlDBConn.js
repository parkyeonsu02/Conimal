import mysql from "mysql2";

export default mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1234",
  database: "animal",
  dateStrings: "date",
});
