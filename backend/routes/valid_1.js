function forloop_callback2(cur_id, callback) {
  connection.query(
    "SELECT credit from dku_timetable_m where id = ?",
    [parseInt(cur_id)], // cases[x].data
    function(err, rows) {
      if (err) throw err;
      // credit_sum += parseInt(rows[0].credit);
      console.log("  in sql ID is ", cur_id, "credit is ", rows[0].credit);
      return callback(rows[0].credit);
    }
  );
}

// ! var combinated_valid_1 = case_cal_module_2.valid1(argu[1].count, argu[1].cases, argu[1].interval);
function valid1(data_count, data_cases, data_interval) {
  var list_credit_checked;
  for (var x = 0; x < data_count; x++) {}
}
for (var x = 0; x < argu[1].count; x++) {
  var interval = argu[1].interval;
  console.log("DATA HANDLE", argu[1].cases[x].data, interval); // DATA HANDLE [ 2198, 2194 ] { minimum: '2', maximum: '6' }
  credit_valid_promises(0, argu[1].cases[x].data) // cummalative , credit_list
    .then(function(argu) {
      var credit_list = [];
      for (idx in argu[1]) {
        forloop_callback2(argu[idx], function(ret) {
          credit_list.push(ret);
        });
      }
      return [argu[1], credit_list];
    })
    .then(function(argu) {
      var summation = argu[1].reduce((a, b) => a + b, 0);
      return [argu[1], summation];
    })
    .then(function(argu) {
      if (argu[1] >= interval.mini && argu[1] <= interval.maxi) {
        list_credit_checked.push([argu[0]]);
      }
    });
}

module.exports = {
  make_combination
};
