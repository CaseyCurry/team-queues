const TaskController = (app, taskData) => {
  return {
    register: () => {
      app.get("/api/queries/queues/:queueId/tasks", async (request, response) => {
        try {
          const tasks = await taskData.getByQueueId(request.params.queueId);
          response.status(200)
            .send(tasks);
        } catch (error) {
          console.error(error);
          response.status(500)
            .send(process.env.DEV ? error : "An error occurred");
        }
      });
    }
  };
};

export { TaskController };