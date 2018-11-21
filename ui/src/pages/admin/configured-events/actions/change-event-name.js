const action = (name) => {
  return {
    type: "CHANGE_EVENT_NAME",
    payload: {
      name
    }
  };
};

export default action;
