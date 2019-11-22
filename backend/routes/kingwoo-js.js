/* //? 19.11.02 KTH, implement fucntion "make_combination"
* ARGUMENT object description
* function needs one argument -  obj_data

* obj_data is a object.
* interval means minimum and maximum credit
* KEY means lecture code, VALUE means list of index (index in DB)
* consequently, obj_data is a collection of user's choice

var obj_data = {
  interval: {
    minimum: 16,
    maximum: 21
  },
  data: {
    50810: [1, 3, 5],
    91091: [10, 25, 88],
    120310: [4, 980, 777]
  }
};


* RETURN object description
* function returns 'dict_ret'
* 'dict_ret' contains many 'dict_case' (0 to infinite)

* NOTION
* CANNOT USE dict_ret IMMEDIATELY, NEED VALIDATION

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

//
var sample_input1 = {
  interval: {
    minimum: 16,
    maximum: 21
  },
  data: {
    50810: [1, 3, 5],
    91091: [10, 25, 88, 1098],
    120310: [4, 980, 777],
    1234: [1111, 2222, 3333],
    5699: [6666, 5555, 4444],
    4377: [123, 456, 789],
    7541: [12322, 1232, 1001]
  }
};

var sample_input2 = {
  interval: {
    minimum: 16,
    maximum: 21
  },
  data: {
    50810: [1, 3, 5],
    91091: [10, 25, 88, 1098]
  }
};

function make_combination(obj_data) {
  var ret = {
    count: 0,
    cases: [
      {
        data: []
      }
    ]
  };
  var sequence = Object.keys(obj_data.data);

  var int_given_lecture_count = Object.keys(obj_data.data).length;
  for (var i = 0; i < int_given_lecture_count; i++) {
    var int_cur_len = ret.cases.length;

    for (var x = 0; x < int_cur_len; x++) {
      var obj_cur_case = ret.cases.shift();
      var list_tmp_case = obj_cur_case.data;
      var int_lec_code = sequence[i];
      var list_lec_pks = obj_data.data[int_lec_code];

      for (idx in list_lec_pks) {
        var list_insert = Array.prototype.slice.call(list_tmp_case);
        var int_each_pk = list_lec_pks[idx];
        list_insert.push(int_each_pk);

        var obj_tmp_case = {};
        obj_tmp_case.data = list_insert;
        ret.cases.push(obj_tmp_case);
      }
      ret.cases.push({ data: list_tmp_case });
      //   console.log("--------------------------------");
      //   console.log(ret.cases);
      //   console.log();
    }
  }
  return ret;
}

// test code
// vv = make_combination(sample_input1);
// console.log(vv);
// console.log(vv.cases.length);

module.exports = {
  make_combination
};
