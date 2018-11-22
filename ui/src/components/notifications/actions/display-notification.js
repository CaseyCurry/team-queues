const action = (id) => {
  return {
    type: "DISPLAY_NOTIFICATION",
    payload: {
      id
    }
  };
};

export default action;
