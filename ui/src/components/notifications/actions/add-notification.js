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
    };
  };
};

export default action;
