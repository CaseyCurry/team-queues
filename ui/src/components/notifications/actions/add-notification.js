import actions from "./";
const notificationExpirationInSeconds = 5;
let nextId = 0;

const action = (type) => {
  return (notification) => {
    return (dispatch) => {
      const id = nextId++;
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          notification: Object.assign({}, notification, {
            id,
            type
          })
        }
      });

      // this will transition the notification into display
      setTimeout(() => {
        dispatch(actions.displayNotification(id));
      }, 0);

      // this will transition the notification out of display
      setTimeout(() => {
        dispatch(actions.expireNotification(id));
      }, notificationExpirationInSeconds * 1000);

      // this will remove the notification from the DOM
      setTimeout(() => {
        dispatch(actions.removeNotification(id));
      }, (notificationExpirationInSeconds + 5) * 1000);
    };
  };
};

export default action;
