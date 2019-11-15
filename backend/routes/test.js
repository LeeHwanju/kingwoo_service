var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var dbconfig = require("../config/database.js");
var connection = mysql.createConnection(dbconfig);

router.get("/", function(req, res) {
  connection.query("SELECT * from dku_timetable_m", function(err, rows) {
    if (err) throw err;
    console.log("The solution is: ", rows);
    res.send(rows);
  });
});

router.get("/search", function(req, res) {
  //   console.log("The solution is: ", req);
  //   console.log("======================");
  console.log(req.query.keyword); // 받아온 검색어는 여기에 저장됨
  connection.query(
    "SELECT * FROM dku_timetable_m WHERE lecture_name LIKE ?",
    "%" + String(req.query.keyword) + "%",

    //! qeury example
    //   "SELECT * FROM card WHERE name LIKE " + connection.escape('%'+req.body.search+'%')
    // connection.query('SELECT * from django_session where session_key like ?', '%' + value + '%',
    //! IF use korean, MUST USE UTF-8

    function(err, rows) {
      if (err) throw err;
      console.log(rows);
      res.send(rows);
    }
  );
});

router.get("/submit", function(req, res) {
  console.log(req.query, function(err, rows) {
    if (err) throw err;
    res.send(rows);
  });
});

module.exports = router;
