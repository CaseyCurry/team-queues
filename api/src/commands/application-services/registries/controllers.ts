import { Express } from "express";
import { Repositories } from "./repositories";
import { ConfiguredEventController } from "../controllers/configured-event-controller";
import { LifecycleController } from "../controllers/lifecycle-controller";
import { DomainServices } from "./domain-services";

export class Controllers {
  public configuredEvent: ConfiguredEventController;
  public lifecycle: LifecycleController;

  constructor(
    private app: Express,
    private domainServices: DomainServices,
    private repositories: Repositories
  ) {
    const configuredEventController = new ConfiguredEventController(
      app,
      domainServices.domainEventFilter,
      repositories.configuredEvent
    );
    const lifecycleController = new LifecycleController(
      app,
      domainServices.domainEventFilter,
      repositories.lifecycle
    );
    this.configuredEvent = configuredEventController;
    this.lifecycle = lifecycleController;
  }
}
