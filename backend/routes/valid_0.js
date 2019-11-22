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

function valid_0_step1(list_input, credit_info, callback) {
  var obj_data_to_make = {
    interval: {
      minimum: credit_info[0],
      maximum: credit_info[1]
    },
    data: {}
  };
  // console.log("init ", credit_info);

  for (i in list_input) {
    forloop_callback1(obj_data_to_make, list_input, i, function(
      obj_data_to_make,
      input_id,
      input_code
    ) {
      // console.log("in for loop", obj_data_to_make.data);
      return !obj_data_to_make.data.hasOwnProperty(parseInt(input_code))
        ? (obj_data_to_make.data[parseInt(input_code)] = [input_id])
        : obj_data_to_make.data[parseInt(input_code)].push(input_id);
    });
  }

  // Promise test
  function for_next_step(i, input_data) {
    return new Promise(function(resolve, reject) {
      // console.log(i, input_data); // 여기까지는 문제가 없다.
      resolve([i, input_data]); // resolve는 하나로 묶어서 해줘야 한다.
    });
  }
  setTimeout(() => {
    // console.log("fin ", obj_data_to_make);
    // return callback(obj_data_to_make);
    return (function() {
      var combinated = [];
      var i = 1;
      for_next_step(i, obj_data_to_make)
        // ! Promise Start with resolve..
        /*
        var i = 1 // indicate STEP
        var obj_data_to_make = {
          interval: { minimum: "12", maximum: "20" },
          data: {
            "362810": [2198, 2199],
            "421520": [2195, 2194],
            "527800": [744, 745]
          }
        };
         */

        .then(function(argu) {
          // ! STEP 1 function start
          console.log("STEP", argu[0]);
          console.log("with this argument ", "\n", argu[1]);
          var combinated = case_calcul_module.make_combination(argu[1]);
          combinated.count = combinated.cases.length;
          // combinated.interval = argu[1].interval;
          return [argu[0] + 0.5, argu[1], combinated];
          // ! STEP 1 RETURNS ...
          /*
          combinated = 
          { count: 27,
            cases: [ 
              { data: [Array] },
              { data: [Array] },
              { data: [Array] },
              { data: [Array] },
              { data: [Array] },
              { data: [Array] }, ...
            ]
          }
          */
        })
        .then(function(argu) {
          // ! STEP 1.5 function start
          console.log("STEP", argu[0]);
          console.log("with this argument ", "\n", argu[1], "\n", argu[2]);
          argu[2].interval = argu[1].interval;
          return [argu[0] + 0.5, argu[2]];
          // ! STEP 1.5 RETURNS ...
          /*
          { count: 27,
            interval: { minimum: "12", maximum: "20" },
            cases: [ 
              { data: [Array] },
              { data: [Array] },
              { data: [Array] },
              { data: [Array] },
              { data: [Array] },
              { data: [Array] }, ...
            ]
          }
          */
        })
        .then(function(argu) {
          // ! STEP 2 function start
          console.log("STEP", argu[0]);
          console.log("with this argument ", "\n", argu[1]);
          // console.log(argu[1]);
          // return [argu[0] + 1, argu[1]];
          var list_credit_checked = [];
          // const case_count = argu[1].count; //! 변수선언한 것을 for문 내부에서 사용할 수 없음 -> 이부분 동기 처리를 하는 방법은?
          // const cases = argu[1].cases;
          // const interval = argu[1].interval;
          for (var x = 0; x < argu[1].count; x++) {
            var credit_sum = 0;
            console.log(argu[1].cases[x].data);
            for (idx in argu[1].cases[x].data) {
              forloop_callback2(
                argu[1].cases[x].data,
                sum_value,
                idx,
                function() {}
              );
            }
            if (
              credit_sum >= argu[1].interval.mini &&
              credit_sum <= argu[1].interval.maxi
            ) {
              list_credit_checked.push(cases[x]);
            }
          }
          return [argu[0] + 1, list_credit_checked];
        })
        .then(function(argu) {
          callback(argu[1]); // res.send() 로 넘어가는 부분
        })
        .catch(function(err) {
          console.log(err);
        });
    })();
    /*
    ! obj_data_to_make에 주어진 id를 다시 역으로 과목코드와 id로 구성한 정보가 들어있음.
    ! 현재 위 callback에는 res.send()가 걸려있음
    ! 실험결과 : 즉시실행함수로는 연쇄적으로 파라미터를 전달할 수 없다.
    ! 함수를 선언해서 처리해야 함
    ! 특이사항 : return 은 for문 끝나기를 기다려주지 않는다.
    ! 콜백함수로 넘겨야할때, 미리 만들어둔 함수를 사용하는 방법은?
    */
  }, 500);
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

function forloop_callback2(list_input, idx, sum_value, callback) {
  connection.query(
    "SELECT credit from dku_timetable_m where id = ?",
    [parseInt(argu[1].cases[x].data[idx])], // cases[x].data
    function(err, rows) {
      if (err) throw err;
      // credit_sum += parseInt(rows[0].credit);
      return callback(result_checked_list);
    }
  );
}

router.get("/valid0", function(req, res) {
  var list_input = req.query.keyword; // [ '1445', '1444', '1443', '1442' ]
  var mini_credit = req.query.mini;
  var maxi_credit = req.query.maxi;
  setTimeout(() => {
    valid_0_step1(list_input, [mini_credit, maxi_credit], function(ret) {
      console.log(ret);
      res.send();
    });
  }, 1000);
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
