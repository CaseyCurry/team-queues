const originalFetch = window.fetch;

// TODO: include correlation id and authorization with all requests
window.fetch = function() {
  let input = arguments[0];
  if (typeof input === "string") {
    input = `http://localhost:8083${input}`;
  } else {
    throw new Error("Request type is not supported in this patched version of fetch");
  }
  const init = arguments.length > 1 ? arguments[1] : undefined;
  return originalFetch(input, init);
};
