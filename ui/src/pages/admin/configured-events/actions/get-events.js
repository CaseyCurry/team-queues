export default (searchString) => {
  return (dispatch) => {
    dispatch({
      type: "GET_EVENTS_PENDING"
    });
    // TODO: abstract http calls; include correlation id with all requests
    fetch("http://localhost:8083/api/commands/configured-events")
      .then((response) => {
        response.json()
          .then((result) => {
            dispatch({
              type: "GET_EVENTS_FULFILLED",
              payload: {
                searchString,
                events: result
              }
            });
          });
      })
      .catch((error) => {
        dispatch({
          type: "GET_EVENTS_REJECTED",
          payload: error
        });
      });
  };
};
