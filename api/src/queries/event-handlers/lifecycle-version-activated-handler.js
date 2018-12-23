// TODO: With the new model for lifecycles is the read model different enough to warrant CQRS?
const LifecycleVersionActivatedHandler = (domainEvents, queueData) => {
  const handler = async event => {
    const lifecycle = event.message.lifecycle;
    console.debug(
      `handling ${event.name} for lifecycle ${lifecycle.id} version ${
        lifecycle.version.number
      }`
    );
    const queues = lifecycle.version.queues.map(queue => {
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
      domainEvents.listenAndHandleOnce(
        "team-queues.lifecycle-version-activated",
        handler
      );
    }
  };
};

export { LifecycleVersionActivatedHandler };
