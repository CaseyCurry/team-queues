// TODO: move events to registry
import { LifecycleModifiedEvent } from "../../domain/events/lifecycle-modified-event";

const LifecycleController = (app, domainEvents, lifecycleAggregate, lifecycleFactory, lifecycleRepository, lifecycleActivator) => {
  return {
    register: () => {
      app.post("/api/commands/lifecycles", async (request, response) => {
        let lifecycle;
        try {
          lifecycle = lifecycleFactory.create(request.body);
        } catch (error) {
          console.error(error);
          response.status(400)
            .end();
          return;
        }
        try {
          // TODO: What needs to be checked to handle versioning and concurrency?
          // TODO: use 412 for concurrency issues
          // TODO: confirm all events have been configured
          if (await lifecycleRepository.getById(lifecycle.id)) {
            response.status(409)
              .end();
            return;
          }
          await lifecycleRepository.create(lifecycle);
          domainEvents.raise(new LifecycleModifiedEvent(lifecycle));
          response.status(201)
            .send({
              id: lifecycle.id
            });
        } catch (error) {
          console.error(error);
          response.status(500)
            .end();
        }
      });

      app.get("/api/commands/lifecycles", async (request, response) => {
        try {
          const events = await lifecycleRepository.getAll();
          response.status(200)
            .send(events);
        } catch (error) {
          console.error(error);
          response.status(500)
            .end();
        }
      });

      app.put("/api/commands/lifecycles/:id", async (request, response) => {
        let lifecycle;
        try {
          lifecycle = new lifecycleAggregate(request.body);
          if (lifecycle.id !== request.params.id) {
            throw new Error("The resource id in the url does not match the lifecycle id in the body");
          }
        } catch (error) {
          console.error(error);
          response.status(400)
            .end();
          return;
        }
        try {
          // TODO: What needs to be checked to handle versioning and concurrency?
          // TODO: confirm all events have been configured
          const existingLifecycle = await lifecycleRepository.getById(lifecycle.id);
          if (!existingLifecycle) {
            response.status(404)
              .end();
            return;
          }
          if (!existingLifecycle.canBeModified()) {
            response.status(405)
              .end();
            return;
          }
          // TODO: move update - which will allow validation - and domain event to aggregate
          await lifecycleRepository.update(lifecycle);
          domainEvents.raise(new LifecycleModifiedEvent(lifecycle));
          response.status(200)
            .end();
        } catch (error) {
          console.error(error);
          response.status(500)
            .end();
        }
      });

      app.post("/api/commands/lifecycles/:id/active", async (request, response) => {
        try {
          // TODO: What needs to be checked to handle versioning and concurrency?
          const existingLifecycle = await lifecycleRepository.getById(request.params.id);
          if (!existingLifecycle) {
            response.status(404)
              .end();
            return;
          }
          if (!existingLifecycle.canBeModified()) {
            response.status(405)
              .end();
            return;
          }
          await lifecycleActivator.activate(existingLifecycle);
          response.status(200)
            .end();
        } catch (error) {
          console.error(error);
          response.status(500)
            .end();
        }
      });
    }
  };
};

export { LifecycleController };
