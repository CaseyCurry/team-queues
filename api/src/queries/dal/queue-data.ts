import { QueueStore } from "./queue-store";

export class QueueData {
  constructor(private store: QueueStore) {}

  public async createMany(queues: any[]): Promise<void> {
    const client = await this.store.getClient();
    await client.collection.insertMany(queues);
    client.close();
  }

  public async deleteByLifecycle(lifecycleId: string): Promise<void> {
    const client = await this.store.getClient();
    await client.collection.deleteMany({ lifecycleId });
    client.close();
  }

  public async getAll(): Promise<any> {
    const client = await this.store.getClient();
    const queues = await client.collection.find({}).toArray();
    client.close();
    return queues;
  }
}
