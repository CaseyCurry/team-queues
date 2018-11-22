const action = (lifecycle) => {
  return (dispatch) => {
    dispatch({
      type: "SELECT_LIFECYCLE",
      payload: {
        lifecycle
      }
    });
  };
};

export default action;
