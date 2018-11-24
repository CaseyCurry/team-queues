const action = (hasNextVersionBeenModified) => {
  return {
    type: "MODIFY_NEXT_VERSION",
    payload: {
      hasNextVersionBeenModified
    }
  };
};

export default action;
