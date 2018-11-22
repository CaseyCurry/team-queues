import getLifecycles from "./get-lifecycles";
import notifications from "../../../../components/notifications/actions";

const action = (lifecycle) => {
  return (dispatch) => {
    dispatch({
      type: "SAVE_LIFECYCLE_PENDING"
    });
    // TODO: abstract http calls; include correlation id with all requests
    fetch("http://localhost:8083/api/commands/lifecycles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(lifecycle)
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(getLifecycles(lifecycle.name));
        } else {
          dispatch(notifications.addError({
            message: "An error occurred on the server saving the lifecycle"
          }));
          dispatch({
            type: "SAVE_LIFECYCLE_REJECTED"
          });
        }
      })
      .catch(() => {
        dispatch(notifications.addError({
          message: "An error occurred on the client saving the lifecycle"
        }));
        dispatch({
          type: "SAVE_LIFECYCLE_REJECTED"
        });
      });
  };
};

export default action;
