import getLifecycles from "./get-lifecycles";
import notifications from "../../../../components/notifications/actions";

const action = (lifecycle) => {
  const nextVersionId = lifecycle.nextVersion.id;
  return (dispatch) => {
    dispatch({
      type: "ACTIVATE_NEXT_VERSION_PENDING"
    });
    // TODO: abstract http calls; include correlation id with all requests
    const url = `http://localhost:8083/api/commands/lifecycles/${nextVersionId}/active`;
    fetch(url, {
      method: "POST"
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(getLifecycles(lifecycle.lifecycleOf));
          dispatch(notifications.addInfo({
            message: "next version of lifecycle activated"
          }));
        } else {
          dispatch(notifications.addError({
            message: "error occurred on the server activating the next version of the lifecycle"
          }));
          dispatch({
            type: "ACTIVATE_NEXT_VERSION_REJECTED"
          });
        }
      })
      .catch(() => {
        dispatch(notifications.addError({
          message: "error occurred on the client activating the next version of the lifecycle"
        }));
        dispatch({
          type: "ACTIVATE_NEXT_VERSION_REJECTED"
        });
      });
  };
};

export default action;
