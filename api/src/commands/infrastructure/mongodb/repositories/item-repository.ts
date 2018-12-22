import { Item } from "../../../domain/aggregates/item";
import { ItemStore } from "../stores/item-store";

export class ItemRepository {
  constructor(private store: ItemStore) {}

  public async createOrUpdate(item: Item): Promise<void> {
    const extendedItem = { ...item, _id: item.id };
    const client = await this.store.getClient();
    await client.collection.updateOne(
      {
        _id: item.id
      },
      {
        $set: extendedItem
      },
      {
        upsert: true
      }
    );
    client.close();
  }

  public async getById(id: string): Promise<Item | null> {
    const client = await this.store.getClient();
    const item = await client.collection.findOne({ _id: id });
    client.close();
    if (!item) {
      return null;
    }
    return new Item(item);
  }

  public async getByForeignId(
    lifecycleId: string,
    foreignId: string
  ): Promise<Item | null> {
    const client = await this.store.getClient();
    const item = await client.collection.findOne({
      lifecycleId,
      foreignId
    });
    client.close();
    if (!item) {
      return null;
    }
    return new Item(item);
  }
}
