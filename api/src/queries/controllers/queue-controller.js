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
            .send(process.env.DEV ? error : "An error occurred");
        }
      });
    }
  };
};

export { QueueController };