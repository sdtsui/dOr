let _ = require('underscore');
let dOr = require('./dOr.js');
console.log('dor', dOr);

let listener = new dOr(5, window, 300);


listener.onTilt((data) => {
  console.log(Date.now());
  console.log('ON TILT :', data)}, 500);