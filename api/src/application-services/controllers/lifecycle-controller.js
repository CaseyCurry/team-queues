const LifecycleController = (app, domainEvents, lifecycleFactory, lifecycleRepository) => {
  return {
    register: () => {
      app.post("/lifecycles", async (request, response) => {
        let lifecycle;
        try {
          lifecycle = lifecycleFactory.create(request.body);
        } catch (error) {
          console.error(error);
          response.status(400)
            .send(error);
          return;
        }
        try {
          if (await lifecycleRepository.getById(lifecycle.id)) {
            response.status(200)
              .end();
            return;
          }
          // TODO: What needs to be checked to handle versioning and concurrency?
          // TODO: confirm all events have been configured
          // TODO: make sure there is only one active lifecycle at a time
          await lifecycleRepository.create(lifecycle);
          response.status(201)
            .send(lifecycle.id);
        } catch (error) {
          console.error(error);
          response.status(500)
            .send(process.env.DEV ? error : "An error occurred");
        }
      });
    }
  };
};

export { LifecycleController };