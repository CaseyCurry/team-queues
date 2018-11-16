const TaskController = (app, taskData) => {
  return {
    register: () => {
      app.get("/api/queries/tasks", async (request, response) => {
        try {
          const tasks = await taskData.getAll();
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