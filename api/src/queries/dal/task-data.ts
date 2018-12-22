import { TaskStore } from "./task-store";

export class TaskData {
  constructor(private store: TaskStore) {}

  public async create(taskToCreate: any, existingTasks: any[], etag: string) {
    const updates: any[] = existingTasks.map(task => {
      return {
        replaceOne: {
          filter: { "item.id": task.item.id, id: task.id },
          replacement: { ...task, etag }
        }
      };
    });
    const client = await this.store.getClient();
    await client.collection.bulkWrite(
      updates.concat([
        {
          insertOne: {
            document: { ...taskToCreate, etag }
          }
        }
      ])
    );
    client.close();
  }

  public async delete(
    taskToDelete: any,
    existingTasks: any[],
    etag: string
  ): Promise<void> {
    const updates: any[] = existingTasks.map(task => {
      return {
        replaceOne: {
          filter: { "item.id": task.item.id, id: task.id },
          replacement: { ...task, etag }
        }
      };
    });
    const client = await this.store.getClient();
    await client.collection.bulkWrite(
      updates.concat([
        {
          deleteOne: {
            filter: { id: taskToDelete.id }
          }
        }
      ])
    );
    client.close();
  }

  public async getByItemId(itemId: string): Promise<any> {
    const client = await this.store.getClient();
    const tasks = await client.collection.find({ "item.id": itemId }).toArray();
    client.close();
    return tasks;
  }

  public async getByQueue(queueName: string, type: string): Promise<any[]> {
    const client = await this.store.getClient();
    const tasks = await client.collection.find({ queueName, type }).toArray();
    client.close();
    return tasks;
  }
}
