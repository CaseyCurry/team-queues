import getEvents from "./get-events";

const action = (event) => {
  return (dispatch) => {
    dispatch({
      type: "SAVE_EVENT_PENDING"
    });
    // TODO: abstract http calls; include correlation id with all requests
    fetch("http://localhost:8083/api/commands/configured-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event)
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(getEvents(event.name));
        } else {
          dispatch({
            type: "SAVE_EVENT_REJECTED"
          });
        }
      });
  };
};

export default action;
