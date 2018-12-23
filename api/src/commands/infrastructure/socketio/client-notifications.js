const ClientNotifications = io => {
  return {
    send: (channel, message) => {
      if (!channel || typeof channel !== "string") {
        throw new Error("channel must be passed and must be a string");
      }
      if (!message) {
        throw new Error("message must be passed");
      }
      io.emit(channel, message);
      console.debug(`notification emitted on channel ${channel}`);
    }
  };
};

export { ClientNotifications };
