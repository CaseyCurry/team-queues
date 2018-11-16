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
          if (await configuredEventRepository.getByName(configuredEvent.name)) {
            response.status(200)
              .end();
            return;
          }
          await configuredEventRepository.createOrUpdate(configuredEvent);
          response.status(201)
            .send(configuredEvent.name);
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