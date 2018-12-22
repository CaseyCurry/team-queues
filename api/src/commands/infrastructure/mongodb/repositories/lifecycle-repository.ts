import { Lifecycle } from "../../../domain/aggregates/lifecycle";
import { LifecycleStore } from "../stores/lifecycle-store";

export class LifecycleRepository {
  constructor(private store: LifecycleStore) {}

  public async createOrUpdate(lifecycle: Lifecycle): Promise<void> {
    const extendedLifecycle = {
      ...lifecycle,
      _id: lifecycle.id,
      isDeleted: false
    };
    const client = await this.store.getClient();
    await client.collection.updateOne(
      {
        _id: extendedLifecycle.id
      },
      {
        $set: extendedLifecycle
      },
      {
        upsert: true
      }
    );
    client.close();
  }

  public async deleteById(id: string): Promise<void> {
    const client = await this.store.getClient();
    const lifecycle = await client.collection.findOne({
      _id: id,
      isDeleted: false
    });
    if (!lifecycle) {
      return;
    }
    await client.collection.updateOne(
      {
        _id: lifecycle.id
      },
      {
        $set: { ...lifecycle, isDeleted: true }
      }
    );
    client.close();
  }

  public async getById(id: string): Promise<Lifecycle | null> {
    const client = await this.store.getClient();
    const lifecycle = await client.collection.findOne({
      _id: id,
      isDeleted: false
    });
    client.close();
    if (!lifecycle) {
      return null;
    }
    return new Lifecycle(lifecycle);
  }

  public async getAll(): Promise<Lifecycle[]> {
    const client = await this.store.getClient();
    const lifecycles = await client.collection
      .find({ isDeleted: false })
      .toArray();
    client.close();
    return lifecycles.map(lifecycle => new Lifecycle(lifecycle));
  }

  public async getAllWithActiveVersion(): Promise<Lifecycle[]> {
    // TODO: unit test
    const client = await this.store.getClient();
    const lifecycles = await client.collection
      .find({
        isDeleted: false,
        activeVersion: { $exists: true }
      })
      .toArray();
    client.close();
    return lifecycles.map(lifecycle => new Lifecycle(lifecycle));
  }
}
