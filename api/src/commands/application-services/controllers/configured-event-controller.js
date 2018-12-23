import { ConfiguredEventModifiedEvent } from "../../domain/events/configured-event-modified-event";
import { ConfiguredEvent } from "../../domain/aggregates/configured-event";

// TODO: unit test
const ConfiguredEventController = (
  app,
  domainEventFilter,
  configuredEventRepository
) => {
  return {
    register: () => {
      // TODO: consider separating post and put to increase the granularity of logs
      app.post(
        "/api/commands/configured-events",
        async (request, response, next) => {
          let configuredEvent;
          try {
            configuredEvent = new ConfiguredEvent(request.body);
          } catch (error) {
            console.error(error);
            response.status(400).end();
            return;
          }
          try {
            const existingEvent = await configuredEventRepository.getByName(
              configuredEvent.name
            );
            // TODO: check etag
            await configuredEventRepository.createOrUpdate(configuredEvent);
            domainEventFilter.raise(
              new ConfiguredEventModifiedEvent(configuredEvent)
            );
            if (existingEvent) {
              response.status(200).end();
              return;
            }
            response.status(201).send({ name: configuredEvent.name });
          } catch (error) {
            next(error);
          }
        }
      );

      app.get(
        "/api/commands/configured-events",
        async (request, response, next) => {
          try {
            const events = await configuredEventRepository.getAll();
            response.status(200).send(events);
          } catch (error) {
            next(error);
          }
        }
      );
    }
  };
};

export { ConfiguredEventController };
