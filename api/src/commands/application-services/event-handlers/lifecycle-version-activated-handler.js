// TODO: unit test
const LifecycleVersionActivatedHandler = (domainEvents, reregister) => {
  const handler = async () => {
    await reregister();
  };

  return {
    register: async () => {
      domainEvents.listenToBroadcast(
        "team-queues.lifecycle-version-activated",
        handler
      );
    }
  };
};

export { LifecycleVersionActivatedHandler };
