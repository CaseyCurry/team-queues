const ConfiguredEventController = (app, domainEvents, configuredEventFactory, configuredEventRepository) => {
  return {
    register: () => {
      app.post("/api/commands/configured-events", async (request, response) => {
        let configuredEvent;
        try {
          configuredEvent = configuredEventFactory.create(request.body);
        } catch (error) {
          console.error(error);
          response.status(400)
            .send(error);
          return;
        }
        try {
          const existingEvent = await configuredEventRepository.getByName(configuredEvent.name);
          // TODO: check etag
          await configuredEventRepository.createOrUpdate(configuredEvent);
          if (existingEvent) {
            response.status(200)
              .end();
            return;
          }
          response.status(201)
            .send(configuredEvent.name);
        } catch (error) {
          console.error(error);
          response.status(500)
            .send(process.env.DEV ? error : "An error occurred");
        }
      });

      app.get("/api/commands/configured-events", async (request, response) => {
        try {
          const events = await configuredEventRepository.getAll();
          response.status(200)
            .send(events);
        } catch (error) {
          console.error(error);
          response.status(500)
            .send(process.env.DEV ? error : "An error occurred");
        }
      });
    }
  };
};

export { ConfiguredEventController };
