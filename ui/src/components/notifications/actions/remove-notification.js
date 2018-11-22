const action = (id) => {
  return {
    type: "REMOVE_NOTIFICATION",
    payload: {
      id
    }
  };
};

export default action;
