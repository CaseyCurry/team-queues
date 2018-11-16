import { Repositories } from "./repositories";
import { Factories } from "./factories";
import { ConfiguredEventController } from "../controllers/configured-event-controller";
import { ItemController } from "../controllers/item-controller";
import { LifecycleController } from "../controllers/lifecycle-controller";

const Controllers = (app, domainEvents) => {
  const configuredEventController = ConfiguredEventController(
    app,
    domainEvents,
    Factories.configuredEvent,
    Repositories.configuredEvent);
  const itemController = ItemController(
    app,
    Repositories.item);
  const lifecycleController = LifecycleController(
    app,
    domainEvents,
    Factories.lifecycle,
    Repositories.lifecycle);
  return {
    configuredEvent: configuredEventController,
    item: itemController,
    lifecycle: lifecycleController
  };
};

export { Controllers };