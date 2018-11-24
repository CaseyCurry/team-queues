import getEvents from "./get-events";
import notifications from "../../../../components/notifications/actions";

const action = (event) => {
  return (dispatch) => {
    dispatch({
      type: "SAVE_EVENT_PENDING"
    });
    fetch("/api/commands/configured-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event)
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(getEvents(event.name));
          dispatch(notifications.addInfo({
            message: "event saved"
          }));
        } else {
          dispatch(notifications.addError({
            message: "error occurred on the server saving the event"
          }));
          dispatch({
            type: "SAVE_EVENT_REJECTED"
          });
        }
      })
      .catch(() => {
        dispatch(notifications.addError({
          message: "error occurred on the client saving the event"
        }));
        dispatch({
          type: "SAVE_EVENT_REJECTED"
        });
      });
  };
};

export default action;
