function for_next_step(i, input_data) {
  return new Promise(function(resolve, reject) {
    // console.log(i, input_data); // 여기까지는 문제가 없다.
    resolve([i, input_data]); // resolve는 하나로 묶어서 해줘야 한다.
  });
}

for_next_step(1, [1, 2, 3])
  .then(function(resolved) {
    console.log(resolved[0]);
    return [resolved[0] + 1, resolved[1]]; // 리턴할때도 계속 묶어서 줘야한다.
  })
  .then(function(resolved) {
    console.log(resolved[0], resolved[1]);
  });
