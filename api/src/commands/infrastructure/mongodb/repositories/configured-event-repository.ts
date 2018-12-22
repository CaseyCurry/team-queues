import { ConfiguredEvent } from "../../../domain/aggregates/configured-event";
import { ConfiguredEventStore } from "../stores/configured-event-store";

export class ConfiguredEventRepository {
  constructor(private store: ConfiguredEventStore) {}

  public async createOrUpdate(event: ConfiguredEvent): Promise<void> {
    const extendedEvent = {
      ...event,
      _id: event.name,
      isDeleted: false
    };
    const client = await this.store.getClient();
    await client.collection.updateOne(
      {
        _id: event.name
      },
      {
        $set: extendedEvent
      },
      {
        upsert: true
      }
    );
    client.close();
  }

  public async deleteByName(name: string): Promise<void> {
    const client = await this.store.getClient();
    const event = await client.collection.findOne({
      _id: name,
      isDeleted: false
    });
    if (!event) {
      return;
    }
    await client.collection.updateOne(
      {
        _id: event.name
      },
      {
        $set: { ...event, isDeleted: true }
      }
    );
    client.close();
  }

  // TODO: unit test this
  public async getByName(name: string): Promise<ConfiguredEvent | null> {
    const client = await this.store.getClient();
    const event = await client.collection.findOne({
      _id: name,
      isDeleted: false
    });
    client.close();
    return event ? new ConfiguredEvent(event) : null;
  }

  public async getAll(): Promise<ConfiguredEvent[]> {
    const client = await this.store.getClient();
    const events = await client.collection.find({ isDeleted: false }).toArray();
    client.close();
    return events.map(event => new ConfiguredEvent(event));
  }

  public async getAllActive(): Promise<ConfiguredEvent[]> {
    // TODO: unit test
    const client = await this.store.getClient();
    const events = await client.collection
      .find({ isDeleted: false, isActive: true })
      .toArray();
    client.close();
    return events.map(event => new ConfiguredEvent(event));
  }
}
