import { MongoClient } from "mongodb";
import { QueueStore } from "./queue-store";
import { QueueData } from "./queue-data";

// TODO: move to config file
const dbLocation = "mongodb://localhost:27017";
// TODO: add special characters to db name and collection name
const dbName = "teamqueuesqueries";
const queueStore = QueueStore(MongoClient, dbLocation, dbName);
const queueData = QueueData(queueStore);

const Dal = {
  queueData
};

export { Dal };
