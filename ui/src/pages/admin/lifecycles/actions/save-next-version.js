import getLifecycles from "./get-lifecycles";
import notifications from "../../../../components/notifications/actions";

const action = (lifecycle) => {
  return (dispatch) => {
    dispatch({
      type: "SAVE_NEXT_VERSION_PENDING"
    });
    fetch(`/api/commands/lifecycles/${lifecycle.id}/versions/next`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(lifecycle)
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(getLifecycles(lifecycle.lifecycleOf));
          dispatch(notifications.addInfo({
            message: "next version of lifecycle saved"
          }));
        } else {
          dispatch(notifications.addError({
            message: "error occurred on the server saving the next version of the lifecycle"
          }));
          dispatch({
            type: "SAVE_NEXT_VERSION_REJECTED"
          });
        }
      })
      .catch(() => {
        dispatch(notifications.addError({
          message: "error occurred on the client saving the next version of the lifecycle"
        }));
        dispatch({
          type: "SAVE_NEXT_VERSION_REJECTED"
        });
      });
  };
};

export default action;
