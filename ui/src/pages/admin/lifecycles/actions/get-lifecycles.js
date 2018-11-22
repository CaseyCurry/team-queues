import notifications from "../../../../components/notifications/actions";

export default (searchString) => {
  return (dispatch) => {
    dispatch({
      type: "GET_LIFECYCLES_PENDING"
    });
    // TODO: abstract http calls; include correlation id with all requests
    fetch("http://localhost:8083/api/commands/lifecycles")
      .then((response) => {
        if (response.status < 200 || response.status > 299) {
          dispatch(notifications.addError({
            message: "An error occurred on the server getting the lifecycles"
          }));
          dispatch({
            type: "GET_LIFECYCLES_REJECTED"
          });
        }
        response.json()
          .then((result) => {
            dispatch({
              type: "GET_LIFECYCLES_FULFILLED",
              payload: {
                searchString,
                lifecycles: result
              }
            });
          });
      })
      .catch(() => {
        dispatch(notifications.addError({
          message: "An error occurred on the client getting the lifecycles"
        }));
        dispatch({
          type: "GET_LIFECYCLES_REJECTED"
        });
      });
  };
};
