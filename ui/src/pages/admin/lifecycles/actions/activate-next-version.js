import getLifecycles from "./get-lifecycles";
import notifications from "../../../../components/notifications/actions";

const action = (lifecycle) => {
  return (dispatch) => {
    dispatch({
      type: "ACTIVATE_NEXT_VERSION_PENDING"
    });
    if (lifecycle.nextVersion.isNew) {
      saveNewVersionAndActivate(dispatch, lifecycle);
    } else {
      activateVersion(dispatch, lifecycle);
    }
  };
};

const saveNewVersionAndActivate = (dispatch, lifecycle) => {
  // TODO: abstract apis
  const nextVersion = Object.assign({}, lifecycle.nextVersion, { lifecycleOf: lifecycle.lifecycleOf });
  fetch("/api/commands/lifecycles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nextVersion)
  })
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        activateVersion(dispatch, lifecycle);
      } else {
        dispatch(notifications.addError({
          message: "error occurred on the server saving the next version of the lifecycle"
        }));
        dispatch({
          type: "ACTIVATE_NEXT_VERSION_REJECTED"
        });
      }
    })
    .catch(() => {
      dispatch(notifications.addError({
        message: "error occurred on the client saving the next version of the lifecycle"
      }));
      dispatch({
        type: "ACTIVATE_NEXT_VERSION_REJECTED"
      });
    });
};

const activateVersion = (dispatch, lifecycle) => {
  const nextVersionId = lifecycle.nextVersion.id;
  const url = `/api/commands/lifecycles/${nextVersionId}/active`;
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

export default action;
