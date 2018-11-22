const action = (event) => {
  return (dispatch) => {
    dispatch({
      type: "SELECT_EVENT",
      payload: {
        event
      }
    });
  };
};

export default action;
