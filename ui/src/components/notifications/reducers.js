export default (state = [], action) => {
  // TODO: add pause functionality
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      return state.slice().concat(Object.assign({}, action.payload.notification, { isNew: true }));
    }
    case "DISPLAY_NOTIFICATION": {
      return state.map((notification) => notification.id === action.payload.id ?
        Object.assign({}, notification, { isDisplayed: true, isExpired: false, isNew: false }) : notification);
    }
    case "EXPIRE_NOTIFICATION": {
      return state.map((notification) => notification.id === action.payload.id ?
        Object.assign({}, notification, { isExpired: true, isDisplayed: false, isNew: false }) : notification);
    }
    case "REMOVE_NOTIFICATION": {
      return state.filter((notification) => notification.id !== action.payload.id);
    }
  }

  return state;
};
