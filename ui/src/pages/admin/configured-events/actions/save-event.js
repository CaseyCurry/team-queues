const action = (event) => {
  return {
    type: "SAVE_EVENT",
    payload: { event }
  };
};

export default action;