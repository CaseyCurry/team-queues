const ClientNotifications = (io) => {
  return {
    send: (channel, message) => {
      const errorMessages = [];
      if (!channel || typeof channel !== "string") {
        errorMessages.push("channel must be passed and must be a string");
      }
      if (!message) {
        errorMessages.push("message must be passed");
      }
      if (errorMessages.length) {
        throw new Error(errorMessages);
      }
      io.emit(channel, message);
      console.debug(`notification emitted on channel ${channel}`);
    }
  };
};

export { ClientNotifications };
