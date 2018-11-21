import getEvents from "./get-events";

const action = (event) => {
  return (dispatch) => {
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
          // TODO: include error message instead of wasSuccessful
          dispatch({
            type: "SAVE_EVENT",
            payload: {
              wasSuccessful: false
            }
          });
        }
      });
  };
};

export default action;
