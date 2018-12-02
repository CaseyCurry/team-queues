const TaskCompletedHandler = (domainEvents, taskData) => {
  const handler = async (event) => {
    const task = event.message.task;
    console.debug(`handling ${event.name} for task ${task.id} in item ${task.itemId}`);
    await taskData.deleteById(task.itemId, task.id);
  };

  return {
    register: async () => {
      domainEvents.listenAndHandleOnce("team-queues.task-completed", handler);
    }
  };
};

export { TaskCompletedHandler };
