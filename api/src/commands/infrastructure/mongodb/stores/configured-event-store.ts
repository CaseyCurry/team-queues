import { MongoClient } from "mongodb";
import { DatabaseClient } from "./database-client";

export class ConfiguredEventStore {
  constructor(private dbLocation: string, private dbName: string) {}

  public async getClient() {
    // TODO: should the client be reused for multiple requests?
    const client: MongoClient = await MongoClient.connect(
      this.dbLocation,
      { useNewUrlParser: true }
    );
    const collection = client.db(this.dbName).collection("configuredevents");
    const databaseClient = new DatabaseClient(client, collection);
    return databaseClient;
  }
}
