const TaskCreatedHandler = (domainEvents, taskData) => {
  const handler = async (event) => {
    const task = event.message.task;
    console.debug(`handling task ${task.id} because the ${event.name} event occurred`);
    if (await taskData.getById(task.id)) {
      return;
    }
    await taskData.create(task);
  };

  return {
    register: async () => {
      domainEvents.listenAndHandleOnce("team-queues.task-created", handler);
    }
  };
};

export { TaskCreatedHandler };