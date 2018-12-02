// TODO: unit test
const ConfiguredEventModifiedHandler = (domainEvents, reregister) => {
  const handler = async () => {
    await reregister();
  };

  return {
    register: async () => {
      domainEvents.listenToBroadcast("team-queues.configured-event-modified", handler);
    }
  };
};

export { ConfiguredEventModifiedHandler };
