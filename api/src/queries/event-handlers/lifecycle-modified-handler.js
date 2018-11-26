const LifecycleModifiedHandler = (domainEvents, queueData) => {
  const handler = async (event) => {
    // TODO: Why are these events being raised once but handled four times?
    const lifecycle = event.message.lifecycle;
    console.debug(`handling lifecycle ${lifecycle.id} because the ${event.name} event occurred`);
    const queues = lifecycle.queues
      .map((queue) => {
        return {
          lifecycleId: lifecycle.id,
          lifecycleOf: lifecycle.lifecycleOf,
          isLifecycleActive: lifecycle.status === "Active",
          queueId: queue.id,
          queueName: queue.name,
          taskType: queue.taskType
        };
      });
    await queueData.deleteByLifecycle(lifecycle.id);
    await queueData.createMany(queues);
  };

  return {
    register: async () => {
      domainEvents.listenAndHandleOnce("team-queues.lifecycle-modified", handler);
    }
  };
};

export { LifecycleModifiedHandler };
