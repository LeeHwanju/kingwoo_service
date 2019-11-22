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
var case_calcul_module = require("./kingwoo-js");
// Request coms from app.use("api/valid");

// CALLBACK structure sample
// 1. make obj_data_to_make and return this.
// function parseValueDone(id) {
// 	auth(id, authDone);
// }
// function authDone(result) {
// 	display(result, displayDone);
// }
// function displayDone(text) {
// 	console.log(text);
// }
// $.get('url', function(response) {
// 	parseValue(response, parseValueDone);
// });
/*

SAMPLE dict_case

1. 
var dict_case = {
  data: [1, 10, 4]
};

2.
var dict_case = {
  data: [3, 10, 777]
};

var dict_ret = {
  count: 5,
  cases: [dict_case, dict_case, dict_case, dict_case, dict_case]
};
*/

function valid_0_step1(list_input, callback) {
  var obj_data_to_make = {
    interval: {
      minimum: 0,
      maximum: 0
    },
    data: {}
  };
  for (i in list_input) {
    forloop_callback1(obj_data_to_make, list_input, i, function(
      obj_data_to_make,
      input_id,
      input_code
    ) {
      // console.log("in for loop", obj_data_to_make.data);
      return !obj_data_to_make.data.hasOwnProperty(String(input_code))
        ? (obj_data_to_make.data[String(input_code)] = [input_id])
        : obj_data_to_make.data[String(input_code)].push(input_id);
    });
  }

  setTimeout(() => {
    // console.log("fin ", obj_data_to_make);
    // return callback(obj_data_to_make);
    return (function() {
      var i = 1;
      console.log("trick ", i);
      function for_next(i, callback) {
        callback(i + 1);
      }
      return for_next(i, function(ret) {
        console.log("trick ", ret);
        return for_next(i, function(ret) {
          console.log("trick ", ret + 1);
          console.log(case_calcul_module.make_combination);
          return callback(obj_data_to_make);
        });
      });
    })();
    /*
    ! obj_data_to_make에 주어진 id를 다시 역으로 과목코드와 id로 구성한 정보가 들어있음.
    ! 현재 위 callback에는 res.send()가 걸려있음
    ! 실험결과 : 즉시실행함수로는 연쇄적으로 파라미터를 전달할 수 없다.
    ! 함수를 선언해서 처리해야 함
    ! 특이사항 : return 은 for문 끝나기를 기다려주지 않는다.
    */
  }, 1000);
}

function forloop_callback1(obj_data_to_make, list_input, i, callback) {
  connection.query(
    "SELECT lecture_code from dku_timetable_m where id = ?",
    [parseInt(list_input[i])],
    function(err, rows) {
      if (err) throw err;
      return callback(
        obj_data_to_make,
        parseInt(list_input[i]),
        String(rows[0].lecture_code)
      );
    }
  );
}

router.get("/valid0", function(req, res) {
  var list_input = req.query.keyword; // [ '1445', '1444', '1443', '1442' ]
  valid_0_step1(list_input, function(ret) {
    console.log(ret);
    res.send();
  });
});

router.get("/search1", function(req, res) {
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

router.get("/submit1", function(req, res) {
  console.log(req.query, function(err, rows) {
    if (err) throw err;
    res.send(rows);
  });
});

module.exports = router;
