import { LifecycleModifiedEvent } from "../../domain/events/lifecycle-modified-event";

const LifecycleController = (app, domainEvents, lifecycleFactory, lifecycleRepository) => {
  return {
    register: () => {
      app.post("/api/commands/lifecycles", async (request, response) => {
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
          // TODO: What needs to be checked to handle versioning and concurrency?
          // TODO: confirm all events have been configured
          // TODO: make sure there is only one active lifecycle at a time
          if (await lifecycleRepository.getById(lifecycle.id)) {
            response.status(409)
              .end();
            return;
          }
          await lifecycleRepository.create(lifecycle);
          domainEvents.raise(new LifecycleModifiedEvent(lifecycle));
          response.status(201)
            .send(lifecycle.id);
        } catch (error) {
          console.error(error);
          response.status(500)
            .send(process.env.DEV ? error : "An error occurred");
        }
      });

      app.put("/api/commands/lifecycles/:id", async (request, response) => {
        let lifecycle;
        try {
          // TODO: considering moving lifecycle factory to ctor and instantiate here
          lifecycle = request.body;
          if (lifecycle.id !== request.params.id) {
            throw new Error("The resource id does not match the lifecycle id");
          }
        } catch (error) {
          console.error(error);
          response.status(400)
            .send(error);
          return;
        }
        try {
          // TODO: What needs to be checked to handle versioning and concurrency?
          // TODO: confirm all events have been configured
          // TODO: make sure there is only one active lifecycle at a time
          if (!await lifecycleRepository.getById(lifecycle.id)) {
            response.status(404)
              .end();
            return;
          }
          await lifecycleRepository.update(lifecycle);
          domainEvents.raise(new LifecycleModifiedEvent(lifecycle));
          response.status(200)
            .end();
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