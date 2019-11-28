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
var async = require("async");
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

function for_next_step(i, input_data) {
  return new Promise(function(resolve, reject) {
    // console.log(i, input_data); // 여기까지는 문제가 없다.
    resolve([i, input_data]); // resolve는 하나로 묶어서 해줘야 한다.
  });
}

function valid_0_step1(list_input, credit_info, mother_callback) {
  var k, fin_ret;
  var obj_data_to_make = {
    interval: {
      minimum: credit_info[0],
      maximum: credit_info[1]
    },
    data: {}
  };
  var combinated;

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

  setTimeout(() => {
    return (function() {
      var combinated = [];
      var i = 1;
      var list_credit_checked = [];
      k = for_next_step(i, obj_data_to_make)
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
          combinated = case_calcul_module.make_combination(argu[1]);
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
          // console.log("with this argument ", "\n", argu[1], "\n", argu[2]);
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
          var datas = argu[1].cases;
          var checked = [];
          setTimeout(() => {
            datas.forEach(e => {
              var cummalative = [];
              // console.log(e);
              e.data.forEach(val => {
                connection.query(
                  "select credit from dku_timetable_m where id = ?",
                  [parseInt(val)],
                  function(err, rows) {
                    cummalative.push(rows[0].credit);
                  }
                );
              });
              setTimeout(() => {
                // console.log("set 100 ", cummalative);
                if (
                  cummalative.reduce((a, b) => a + b, 0) >=
                    obj_data_to_make.interval.minimum &&
                  cummalative.reduce((a, b) => a + b, 0) <=
                    obj_data_to_make.interval.maximum
                ) {
                  // console.log(e);
                  checked.push(e.data);
                }
              }, 500); // 여기 값이 너무 작으면 큰 데이터에 대해서 작동을 못함
            });
          }, 2000);
          fin_ret = checked;
          return [argu[0] + 1, checked, "haha"];
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

  setTimeout(() => {
    console.log(fin_ret);
  }, 5000);
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

function forloop_callback2(cur_id, credit_list) {
  connection.query(
    "SELECT credit from dku_timetable_m where id = ?",
    [parseInt(cur_id)], // cases[x].data
    function(err, rows) {
      if (err) throw err;
      console.log("  in sql ID is ", cur_id, "credit is ", rows[0].credit);
      return credit_list.push(rows[0].credit);
    }
  );
}

router.get("/valid0", function(req, res) {
  var list_input = req.query.keyword; // [ '1445', '1444', '1443', '1442' ]
  var mini_credit = req.query.mini;
  var maxi_credit = req.query.maxi;
  setTimeout(() => {
    valid_0_step1(list_input, [mini_credit, maxi_credit]);
  }, 100);
  setTimeout(() => {
    res.send();
  }, 6000);
});

function inputer(obj_data_to_make, input_id, input_code) {
  // console.log("in for loop", obj_data_to_make.data);
  return !obj_data_to_make.data.hasOwnProperty(parseInt(input_code))
    ? (obj_data_to_make.data[parseInt(input_code)] = [input_id])
    : obj_data_to_make.data[parseInt(input_code)].push(input_id);
}

router.get("/valid_v4", function(req, res) {
  // ************************
  var lists = [];
  var constructed = []; // 경우의 수 계산 버전
  var mini_credit;
  var maxi_credit;
  var obj_data_to_make2 = {
    data: {}
  };
  var connection_lose = {};
  // ************************
  async.waterfall(
    [
      function(callback) {
        console.log("init 1");
        var list_input = req.query.keyword; // [ '1445', '1444', '1443', '1442' ]
        mini_credit = req.query.mini;
        maxi_credit = req.query.maxi;
        callback(null, [list_input, mini_credit, maxi_credit]);
      },

      // obj_data_to_make를 동일하게 구현하는 부분
      // 데이터가 아무리 많아도 여기서 10ms는 넘어갈 일이 없다.
      function(argu, callback) {
        console.log("init 2");
        console.time("obj_making_time");
        var data = argu[0];
        for (i in argu[0]) {
          var e = parseInt(argu[0][i]);
          function adding_to_lose(data) {
            connection_lose[parseInt(data.id)] = data;
          }
          connection.query(
            "SELECT * from dku_timetable_m where id = ?",
            [parseInt(e)],
            function(err, rows) {
              if (err) throw err;
              adding_to_lose(rows[0]);
              return !obj_data_to_make2.data.hasOwnProperty(
                parseInt(rows[0].lecture_code)
              )
                ? (obj_data_to_make2.data[parseInt(rows[0].lecture_code)] = [e])
                : obj_data_to_make2.data[parseInt(rows[0].lecture_code)].push(
                    e
                  );
            }
          );
        }
        console.timeEnd("obj_making_time");
        setTimeout(() => {
          callback(null);
        }, 40);
      },

      // 경우의 수를 계산하는 부분
      // 2만개 까지는 적정선에서 해결되지만 그 이후로는 계산속도가 급격히 느려진다.
      // 4만개까지는 100ms 내에서 처리 가능
      // 넉넉하게 500ms 로 잡아지 고민됨
      function(callback) {
        setTimeout(() => {
          console.log("init 3");
          console.time("make combination time");
          constructed = case_calcul_module.make_combination(obj_data_to_make2);
          constructed.count = constructed.cases.length;
          console.timeEnd("make combination time");
          callback(null);
        }, 30);
      },

      // 학점 범위에 속하는지 검증하는 부분
      // 성능분석 필요
      function(callback) {
        async function tmp_for_callback_structure() {
          for (i in constructed.cases) {
            var cummalative_val = 0;
            var cur_case = await constructed.cases[i];
            //? -----------------
            for (j in cur_case.data) {
              cummalative_val += connection_lose[j].credit;
            }
            //? -----------------

            //? -----------------
            cur_case.data.forEach(e => {});
            //? -----------------

            if (cummalative_val > mini_credit) {
              lists.push(cur_case.data);
            }
          }
        }
        console.time("credit valid time");
        tmp_for_callback_structure();
        console.timeEnd("credit valid time");
        callback(null);
      }
    ],
    function(err) {
      setTimeout(() => {
        if (err) throw err;
        console.log(constructed.count);
        console.log(lists);
        console.log(connection_lose[677]);
        res.send();
      }, 2000);
    }
  );
});

router.get("/valid_v3", function(req, res) {
  var list_input = req.query.keyword; // [ '1445', '1444', '1443', '1442' ]
  var mini_credit = req.query.mini;
  var maxi_credit = req.query.maxi;

  var arr = [
    [1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18]
  ];
  var checked = [];

  setTimeout(() => {
    arr.forEach(e => {
      var cummalative = [];
      console.log(e);
      e.forEach(val => {
        connection.query(
          "select credit from dku_timetable_m where id = ?",
          [parseInt(val)],
          function(err, rows) {
            cummalative.push(rows[0].credit);
          }
        );
      });
      setTimeout(() => {
        if (cummalative.reduce((a, b) => a + b, 0) >= 12) {
          checked.push(e);
        }
      }, 100);
    });
  }, 1);

  setTimeout(() => {
    console.log(checked);
    res.send();
  }, 3000);
});

router.get("/valid_v2", async function(req, res) {
  var list_input = await req.query.keyword; // [ '1445', '1444', '1443', '1442' ]
  var mini_credit = await req.query.mini;
  var maxi_credit = await req.query.maxi;
  var obj_data_to_make = await {
    interval: {
      minimum: mini_credit,
      maximum: maxi_credit
    },
    data: {}
  };
  async.waterfall(
    [
      function(callback2) {
        async.forEachOf(
          list_input,
          function(item, key, callback) {
            connection.query(
              "SELECT lecture_code from dku_timetable_m where id = ?",
              [parseInt(item)],
              function(err, rows) {
                if (err) throw err;
                return inputer(
                  obj_data_to_make,
                  parseInt(item),
                  String(rows[0].lecture_code)
                );
              }
            );
          },
          function(err) {
            callback2(null);
          }
        );
        // for (i in list_input) {
        //   forloop_callback1(obj_data_to_make, list_input, i, function(
        //     obj_data_to_make,
        //     input_id,
        //     input_code
        //   ) {
        //     // console.log("in for loop", obj_data_to_make.data);
        //     return !obj_data_to_make.data.hasOwnProperty(parseInt(input_code))
        //       ? (obj_data_to_make.data[parseInt(input_code)] = [input_id])
        //       : obj_data_to_make.data[parseInt(input_code)].push(input_id);
        //   });
        // }
        // callback(null, obj_data_to_make);
      },
      function(obj_data_to_make, callback) {
        console.log(obj_data_to_make);
        callback(null);
      }
    ],
    function(err) {
      // result now equals 'done'
      res.send();
    }
  );
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
