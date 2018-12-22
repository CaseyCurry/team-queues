import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import kafka from "node-rdkafka";
import http from "http";
import socketIO from "socket.io";
import overrideConsole from "./console-overrides";
import { DomainEvents } from "./commands/infrastructure/kafka/domain-events";
import { ClientNotifications } from "./commands/infrastructure/socketio/client-notifications";
import { DomainServices } from "./commands/application-services/registries/domain-services";
import { Controllers as CommandControllers } from "./commands/application-services/registries/controllers";
import { EventHandlers as CommandEventHandlers } from "./commands/application-services/registries/event-handlers";
import { Controllers as QueryControllers } from "./queries/controllers";
import { EventHandlers as QueryEventHandlers } from "./queries/event-handlers/event-handlers";
import { Repositories as CommandRepositories } from "./commands/application-services/registries/repositories";
import { Data as QueryData } from "./queries/dal/data";

overrideConsole();

const domainEvents = new DomainEvents(kafka);
domainEvents
  .initialize()
  .then(() => {
    const app = express();
    const server = http.createServer(app);
    const clientNotifications = configureClientNotifications(server);
    const domainServices = new DomainServices(
      domainEvents,
      clientNotifications
    );
    const commandRepositories = new CommandRepositories();
    const queryData = new QueryData();
    configureEventHandlers(domainServices, commandRepositories, queryData).then(
      () => {
        configureApi(app, server, () => {
          configureControllers(
            app,
            domainServices,
            commandRepositories,
            queryData
          );
        });
      }
    );
  })
  .catch(error => {
    console.error(error);
  });

const configureClientNotifications = (server: http.Server) => {
  const io = socketIO(server as any, {
    origins: "http://localhost:8082"
  });
  return new ClientNotifications(io);
};

const configureEventHandlers = async (
  domainServices: DomainServices,
  commandRepositories: CommandRepositories,
  queryData: QueryData
) => {
  const configure = async (handlers: any) => {
    for (const handler of Object.keys(handlers)) {
      // TODO: convert some of the debug logs to info
      console.debug(`registering the ${handler} event handler`);
      await handlers[handler].register();
    }
  };
  const commandHandlers = new CommandEventHandlers(
    domainEvents,
    domainServices,
    commandRepositories
  );
  await configure(commandHandlers);
  const queryHandlers = new QueryEventHandlers(domainEvents, queryData);
  await configure(queryHandlers);
  await domainEvents.start();
};

const configureControllers = (
  app: Express,
  domainServices: DomainServices,
  commandRepositories: CommandRepositories,
  queryData: QueryData
) => {
  const configure = (controllers: any) => {
    Object.keys(controllers).forEach(controller => {
      console.debug(`registering the ${controller} controller`);
      controllers[controller].register();
    });
  };
  const commandControllers = new CommandControllers(
    app,
    domainServices,
    commandRepositories
  );
  configure(commandControllers);
  const queryControllers = new QueryControllers(app, queryData);
  configure(queryControllers);
};

const configureApi = (
  app: Express,
  server: http.Server,
  registerRoutes: () => void
) => {
  app.use(helmet());
  app.use(express.json());
  app.use(cors({ origin: "http://localhost:8082" }));

  // add a route for health checking the api
  app.get("/", (request: Request, response: Response) => {
    response.end();
  });

  registerRoutes();

  // this must be the last thing added to app or errors will not go through it
  app.use(
    (
      error: Error,
      request: Request,
      response: Response,
      next: NextFunction
    ) => {
      // eslint-disable-line no-unused-vars
      console.error(error.stack);
      response.status(500).end();
    }
  );

  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    console.log(`team queues are ready at port ${port}, captain!`);
  });
};
