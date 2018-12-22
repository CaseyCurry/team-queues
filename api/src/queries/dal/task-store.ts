import { MongoClient } from "mongodb";
import { DatabaseClient } from "./database-client";

// FIXME: most of this code is repeated and can probably be mostly merged with DatabaseClient
export class TaskStore {
  constructor(private dbLocation: string, private dbName: string) {}

  public async getClient() {
    // TODO: should the client be reused for multiple requests?
    const client = await MongoClient.connect(
      this.dbLocation,
      { useNewUrlParser: true }
    );
    const collection = client.db(this.dbName).collection("tasks");
    const databaseClient = new DatabaseClient(client, collection);
    return databaseClient;
  }
}
