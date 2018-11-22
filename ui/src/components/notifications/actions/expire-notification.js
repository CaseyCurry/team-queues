const action = (id) => {
  return {
    type: "EXPIRE_NOTIFICATION",
    payload: {
      id
    }
  };
};

export default action;
