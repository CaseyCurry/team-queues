import express from "express";
import helmet from "helmet";
import cors from "cors";
import kafka from "kafka-node";
import "./console-overrides";
import { DomainEvents } from "./commands/infrastructure/kafka/domain-events";
import { DomainServices } from "./commands/application-services/registries/domain-services";
import { Controllers as CommandControllers } from "./commands/application-services/registries/controllers";
import { EventHandlers as CommandEventHandlers } from "./commands/application-services/registries/event-handlers";
import { Controllers as QueryControllers } from "./queries/controllers";
import { EventHandlers as QueryEventHandlers } from "./queries/event-handlers";

DomainEvents(kafka)
  .then((domainEvents) => {
    const domainServices = DomainServices();
    configureEventHandlers(domainEvents, domainServices)
      .then(() => {
        configureApi((app) => {
          configureControllers(app, domainEvents);
        });
      });
  })
  .catch((error) => {
    console.error(error);
  });

const configureEventHandlers = async (domainEvents, domainServices) => {
  const configure = async (handlers) => {
    for (const handler of Object.keys(handlers)) {
      // TODO: convert some of the debug logs to info
      console.debug(`registering the ${handler} event handler`);
      await handlers[handler].register();
    }
  };
  const commandHandlers = CommandEventHandlers(domainEvents, domainServices);
  await configure(commandHandlers);
  const queryHandlers = QueryEventHandlers(domainEvents);
  await configure(queryHandlers);
  domainEvents.start();
};

const configureControllers = (app, domainEvents) => {
  const configure = (controllers) => {
    Object.keys(controllers)
      .forEach((controller) => {
        console.debug(`registering the ${controller} controller`);
        controllers[controller].register();
      });
  };
  const commandControllers = CommandControllers(app, domainEvents);
  configure(commandControllers);
  const queryControllers = QueryControllers(app, domainEvents);
  configure(queryControllers);
};

const configureApi = (registerRoutes) => {
  const app = express();
  app.use(helmet());
  app.use(express.json());
  app.use(cors());

  // add a route for health checking the api
  app.get("/", (request, response) => {
    response.end();
  });

  registerRoutes(app);

  // this must be the last thing added to app or errors will not go through it
  app.use((error, request, response, next) => { // eslint-disable-line no-unused-vars
    console.error(error.stack);
    response.status(500)
      .end();
  });

  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`team queues are ready at port ${port}, captain!`);
  });
};
