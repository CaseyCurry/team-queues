const QueueController = (app, queueData) => {
  return {
    register: () => {
      app.get("/api/queries/queues", async (request, response) => {
        try {
          const queues = await queueData.getAll();
          response.status(200)
            .send(queues);
        } catch (error) {
          console.error(error);
          response.status(500)
            .end();
        }
      });

      // TODO: add lifecycle of in the query
      app.get("/api/queries/queues/:queueName/task-types/:taskType/tasks", async (request, response) => {
        try {
          const queueName = request.params.queueName;
          const taskType = request.params.taskType;
          const tasks = await queueData.getTasks(queueName, taskType);
          response.status(200)
            .send(tasks);
        } catch (error) {
          console.error(error);
          response.status(500)
            .end();
        }
      });
    }
  };
};

export {
  QueueController
};
