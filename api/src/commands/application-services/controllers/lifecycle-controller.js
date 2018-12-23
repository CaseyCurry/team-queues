import { Lifecycle } from "../../domain/aggregates/lifecycle";

// TODO: unit test
const LifecycleController = (app, domainEventFilter, lifecycleRepository) => {
  return {
    register: () => {
      // TODO: look at Bunyan's integration with restify
      app.post(
        "/api/commands/lifecycles/:id/versions/next",
        async (request, response, next) => {
          let lifecycle;
          try {
            lifecycle = await lifecycleRepository.getById(request.params.id);
          } catch (error) {
            next(error);
          }
          if (!lifecycle) {
            try {
              lifecycle = new Lifecycle({
                id: request.params.id,
                lifecycleOf: request.body.lifecycleOf
              });
            } catch (error) {
              console.warn(error);
              response.status(400).end();
              return;
            }
          }
          try {
            // TODO: What needs to be checked to handle versioning and concurrency?
            // TODO: use 412 for concurrency issues
            // TODO: confirm all events have been configured
            lifecycle.updateNextVersion(request.body.nextVersion);
            await lifecycleRepository.createOrUpdate(lifecycle);
            response.status(201).send(lifecycle.nextVersion.number.toString());
          } catch (error) {
            next(error);
          }
        }
      );

      app.get("/api/commands/lifecycles", async (request, response, next) => {
        try {
          const events = await lifecycleRepository.getAll();
          response.status(200).send(events);
        } catch (error) {
          next(error);
        }
      });

      app.post(
        "/api/commands/lifecycles/:id/versions/active",
        async (request, response, next) => {
          try {
            // TODO: What needs to be checked to handle versioning and concurrency?
            // TODO: re-version potentially orphaned items
            const lifecycle = await lifecycleRepository.getById(
              request.params.id
            );
            if (!lifecycle) {
              response.status(404).end();
              return;
            }
            lifecycle.activateNextVersion();
            await lifecycleRepository.createOrUpdate(lifecycle);
            domainEventFilter.raise(lifecycle.domainEvents.raisedEvents);
            response
              .status(201)
              .send(lifecycle.activeVersion.number.toString());
          } catch (error) {
            next(error);
          }
        }
      );
    }
  };
};

export { LifecycleController };
