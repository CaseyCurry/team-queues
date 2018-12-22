export default () => {
  const log = console.log;
  const error = console.error;

  // TODO: pull out correlation id and log it with message
  console.log = () => {
    log(new Date().toISOString(), "[INFO]", ...arguments);
  };

  console.info = console.log;

  console.error = () => {
    error(new Date().toISOString(), "[ERROR]", ...arguments);
  };

  console.warn = console.log;

  console.debug = () => {
    if (process.env.DEBUG) {
      log(new Date().toISOString(), "[DEBUG]", ...arguments);
    }
  };
};
