const initialState = Object.freeze({
  notifications: [],
  isPaused: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      return Object.assign({}, state, {
        notifications: state.notifications.slice().concat(action.payload.notification)
      });
    }
    case "REMOVE_NOTIFICATION": {
      return Object.assign({}, state, {
        notifications: state.notifications.filter((notification) => notification.id !== action.payload.id)
      });
    }
    case "PAUSE": {
      return Object.assign({}, state, { isPaused: true });
    }
    case "PLAY": {
      return Object.assign({}, state, { isPaused: false });
    }
  }

  return state;
};
