import { MongoClient, Collection } from "mongodb";

export class DatabaseClient {
  constructor(
    private client: MongoClient,
    public collection: Collection<any>
  ) {}

  public close() {
    this.client.close();
  }
}
