import notifications from "../../../../components/notifications/actions";

export default (searchString) => {
  return (dispatch) => {
    dispatch({
      type: "GET_EVENTS_PENDING"
    });
    fetch("/api/commands/configured-events")
      .then((response) => {
        if (response.status < 200 || response.status > 299) {
          dispatch(notifications.addError({
            message: "An error occurred on the server getting the events"
          }));
          dispatch({
            type: "GET_EVENTS_REJECTED"
          });
        }
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
      .catch(() => {
        dispatch(notifications.addError({
          message: "An error occurred on the client getting the events"
        }));
        dispatch({
          type: "GET_EVENTS_REJECTED"
        });
      });
  };
};
