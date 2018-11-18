export default () => {
  return {
    type: "GET_EVENTS",
    payload: fetch("http://localhost:8083/api/commands/configured-events")
      .then((response) => response.json())
  };
};
