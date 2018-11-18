const action = (event) => {
  return {
    type: "SELECT_EVENT",
    payload: { event }
  };
};

export default action;