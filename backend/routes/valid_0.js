// valid_0.js
// make obj_data described below from ownData: ["1", "2", "3", "4", "5"],
//
// var obj_data = {
//   interval: {
//     minimum: 16,
//     maximum: 21
//   },
//   data: {
//     50810: [1, 3, 5],
//     91091: [10, 25, 88],
//     120310: [4, 980, 777]
//   }
// };

var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var dbconfig = require("../config/database.js");
var connection = mysql.createConnection(dbconfig);

// Request coms from app.use("api/valid");
//

// 1. make obj_data_to_make and return this.
router.get("/search", function(req, res) {
  var list_input = req.query.ownData; // ["1", "2", "3", "4", "5"]
  var obj_data_to_make = {
    interval: {
      minimum: 0,
      maximum: 0
    },
    data: {}
  };

  // Usage example
  // connection.query(
  //   "SELECT lecture_code FROM test_table where id = " + list_input[1],func)

  for (i in list_input) {
    var SQLquery =
      "SELECT lecture_code from test_table where id = ?" + list_input[i];
    connection.query(SQLquery, function(err, rows) {
      if (err) throw err;
      res.send(rows);
    });
  }

  // connection.query("SELECT * from test_table", function(err, rows) {
  //   if (err) throw err;
  //   // console.log("The solution is: ", rows);
  //   res.send(rows);
  // });
});

router.get("/search", function(req, res) {
  //   console.log("The solution is: ", req);
  //   console.log("======================");
  console.log(req.query.keyword); // 받아온 검색어는 여기에 저장됨
  connection.query(
    "SELECT * FROM test_table WHERE lecture_name LIKE ?",
    "%" + String(req.query.keyword) + "%",
    //   "SELECT * FROM card WHERE name LIKE " + connection.escape('%'+req.body.search+'%')
    // connection.query('SELECT * from django_session where session_key like ?', '%' + value + '%',
    //! IF use korean, MUST USE UTF-8

    function(err, rows) {
      if (err) throw err;
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
