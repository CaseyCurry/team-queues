import express from "express";
import helmet from "helmet";
import kafka from "kafka-node";
import { DomainEvents } from "./infrastructure/kafka/domain-events";
import { Controllers } from "./application-services/registries/controllers";
import { EventHandlers } from "./application-services/registries/event-handlers";

global.console.debug = function() {
  if (process.env.DEBUG) {
    console.log.apply(null, arguments);
  }
};

DomainEvents(kafka)
  .then((domainEvents) => {
    configureEventHandlers(domainEvents)
      .then(() => {
        configureApi((app) => {
          configureControllers(app, domainEvents);
        });
      });
  });

const configureEventHandlers = async (domainEvents) => {
  const handlers = EventHandlers(domainEvents);
  for (const handler of Object.keys(handlers)) {
    console.debug(`registering the ${handler} event handler`);
    await handlers[handler].register();
  }
  domainEvents.start();
};

const configureControllers = (app, domainEvents) => {
  const controllers = Controllers(app, domainEvents);
  Object.keys(controllers)
    .forEach((controller) => {
      console.debug(`register the ${controller} controller`);
      controllers[controller].register();
    });
};

const configureApi = (registerRoutes) => {
  const app = express();
  app.use(helmet());
  app.use(express.json());

  // add a route for health checking the api
  app.get("/", (request, response) => {
    response.end();
  });

  registerRoutes(app);

  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`team queues are ready at port ${port}, captain!`);
  });
};