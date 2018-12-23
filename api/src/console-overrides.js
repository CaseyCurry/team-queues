const log = console.log;
const error = console.error;

// TODO: pull out correlation id and log it with message
console.log = function() {
  log(new Date().toISOString(), "[INFO]", ...arguments);
};

console.info = console.log;

console.error = function() {
  error(new Date().toISOString(), "[ERROR]", ...arguments);
};

console.warn = console.log;

console.debug = function() {
  if (process.env.DEBUG) {
    log(new Date().toISOString(), "[DEBUG]", ...arguments);
  }
};
