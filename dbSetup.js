const mysql = require("mysql");

// var conn = mysql.createConnection({
//   host: "us-cdbr-east-02.cleardb.com",
//   user: "b712298c3e1c82",
//   password: "cc1ad2cc",
//   port: "3306",
//   database: "heroku_8050956b50d627d",
//   multipleStatements: true,
// });

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: "3306",
  database: "Dispatch",
  multipleStatements: true,
});

module.exports = conn;
