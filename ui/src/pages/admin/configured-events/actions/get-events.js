import notifications from "../../../../components/notifications/actions";

export default (searchString) => {
  return (dispatch) => {
    dispatch({
      type: "GET_EVENTS_PENDING"
    });
    // TODO: abstract http calls; include correlation id with all requests
    fetch("http://localhost:8083/api/commands/configured-events")
      .then((response) => {
        if (response.status < 200 || response.status > 299) {
          dispatch(notifications.addError({
            message: "An error occurred on the server saving the event"
          }));
          dispatch({
            type: "SAVE_EVENT_REJECTED"
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
