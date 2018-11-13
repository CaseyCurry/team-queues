const log = console.log;
const error = console.error;

console.log = function() {
  log(new Date()
    .toISOString(), "[INFO]", ...arguments);
};

console.info = console.log;

console.error = function() {
  error(new Date()
    .toISOString(), "[ERROR]", ...arguments);
};

console.debug = function() {
  if (process.env.DEBUG) {
    log(new Date()
      .toISOString(), "[DEBUG]", ...arguments);
  }
};