const TaskCreatedHandler = (domainEvents, taskData) => {
  const handler = async (event) => {
    const task = event.message.task;
    console.debug(`handling ${event.name} for task ${task.id} in item ${task.item.id}`);
    const existingTasks = await taskData.getByItemId(task.item.id);
    if (existingTasks.map((existingTask) => existingTask.id)
      .includes(task.id)) {
      return;
    }
    await taskData.create(task, existingTasks, event.message.etag);
  };

  return {
    register: async () => {
      domainEvents.listenAndHandleOnce("team-queues.task-created", handler);
    }
  };
};

export { TaskCreatedHandler };
