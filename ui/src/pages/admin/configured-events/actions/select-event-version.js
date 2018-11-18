const action = (version) => {
  return {
    type: "SELECT_EVENT_VERSION",
    payload: { version }
  };
};

export default action;
