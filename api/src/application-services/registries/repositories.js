import { MongoClient } from "mongodb";
import { LifecycleStore } from "../../infrastructure/mongodb/stores/lifecycle-store";
import { LifecycleRepository } from "../../infrastructure/mongodb/repositories/lifecycle-repository";
import { ItemStore } from "../../infrastructure/mongodb/stores/item-store";
import { ItemRepository } from "../../infrastructure/mongodb/repositories/item-repository";
import { ConfiguredEventStore } from "../../infrastructure/mongodb/stores/configured-event-store";
import { ConfiguredEventRepository } from "../../infrastructure/mongodb/repositories/configured-event-repository";

// TODO: move to config file
const dbLocation = "mongodb://localhost:27017";
const dbName = "teamqueues";
const lifecycleStore = LifecycleStore(MongoClient, dbLocation, dbName);
const lifecycleRepository = LifecycleRepository(lifecycleStore);
const configuredEventStore = ConfiguredEventStore(MongoClient, dbLocation, dbName);
const configuredEventRepository = ConfiguredEventRepository(configuredEventStore);
const itemStore = ItemStore(MongoClient, dbLocation, dbName);
const itemRepository = ItemRepository(itemStore);

const Repositories = {
  lifecycle: lifecycleRepository,
  item: itemRepository,
  configuredEvent: configuredEventRepository
};

export { Repositories };