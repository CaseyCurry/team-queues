import { LifecycleStore } from "../../infrastructure/mongodb/stores/lifecycle-store";
import { LifecycleRepository } from "../../infrastructure/mongodb/repositories/lifecycle-repository";
import { ItemStore } from "../../infrastructure/mongodb/stores/item-store";
import { ItemRepository } from "../../infrastructure/mongodb/repositories/item-repository";
import { ConfiguredEventStore } from "../../infrastructure/mongodb/stores/configured-event-store";
import { ConfiguredEventRepository } from "../../infrastructure/mongodb/repositories/configured-event-repository";

export class Repositories {
  public lifecycle: LifecycleRepository;
  public item: ItemRepository;
  public configuredEvent: ConfiguredEventRepository;
  // TODO: move to config file
  private dbLocation = "mongodb://localhost:27017";
  private dbName = "teamqueuescommands";

  constructor() {
    const lifecycleStore = new LifecycleStore(this.dbLocation, this.dbName);
    const lifecycleRepository = new LifecycleRepository(lifecycleStore);
    this.lifecycle = lifecycleRepository;
    const configuredEventStore = new ConfiguredEventStore(
      this.dbLocation,
      this.dbName
    );
    const configuredEventRepository = new ConfiguredEventRepository(
      configuredEventStore
    );
    this.configuredEvent = configuredEventRepository;
    const itemStore = new ItemStore(this.dbLocation, this.dbName);
    const itemRepository = new ItemRepository(itemStore);
    this.item = itemRepository;
  }
}
