const action = (event) => {
  return {
    type: "SAVE_EVENT",
    payload: fetch("http://localhost:8083/api/commands/configured-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(event)
    }).then((response) => response.json())
    // payload: { event }
  };
};

export default action;
