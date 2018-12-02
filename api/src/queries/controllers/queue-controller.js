const QueueController = (app, queueData, taskData) => {
  return {
    register: () => {
      app.get("/api/queries/queues", async (request, response, next) => {
        try {
          const queues = await queueData.getAll();
          response.status(200)
            .send(queues);
        } catch (error) {
          next(error);
        }
      });

      // TODO: add lifecycle of in the query
      app.get("/api/queries/queues/:queueName/task-types/:type/tasks", async (request, response, next) => {
        try {
          const queueName = request.params.queueName;
          const type = request.params.type;
          const tasks = await taskData.getByQueue(queueName, type);
          response.status(200)
            .send(tasks);
        } catch (error) {
          next(error);
        }
      });
    }
  };
};

export {
  QueueController
};
