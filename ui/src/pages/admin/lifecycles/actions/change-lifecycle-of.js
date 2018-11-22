const action = (lifecycleOf) => {
  return {
    type: "CHANGE_LIFECYCLE_OF",
    payload: {
      lifecycleOf
    }
  };
};

export default action;
