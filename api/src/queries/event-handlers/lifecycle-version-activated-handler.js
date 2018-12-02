const LifecycleVersionActivatedHandler = (domainEvents, queueData) => {
  const handler = async (event) => {
    // TODO: Why are these events being raised once but handled four times?
    const lifecycle = event.message.lifecycle;
    console.debug(`handling ${event.name} for lifecycle ${lifecycle.id} version ${lifecycle.version.number}`);
    const queues = lifecycle.version.queues
      .map((queue) => {
        return {
          lifecycleId: lifecycle.id,
          lifecycleOf: lifecycle.lifecycleOf,
          queueName: queue.name,
          taskType: queue.taskType
        };
      });
    await queueData.deleteByLifecycle(lifecycle.id);
    if (queues.length) {
      await queueData.createMany(queues);
    }
  };

  return {
    register: async () => {
      domainEvents.listenAndHandleOnce("team-queues.lifecycle-version-activated", handler);
    }
  };
};

export { LifecycleVersionActivatedHandler };
