import { MongoClient } from "mongodb";
import { QueueStore } from "./queue-store";
import { QueueData } from "./queue-data";
import { TaskStore } from "./task-store";
import { TaskData } from "./task-data";

// TODO: move to config file
const dbLocation = "mongodb://localhost:27017";
// TODO: add special characters to db name and collection name
const dbName = "teamqueuesqueries";
const queueStore = QueueStore(MongoClient, dbLocation, dbName);
const queueData = QueueData(queueStore);
const taskStore = TaskStore(MongoClient, dbLocation, dbName);
const taskData = TaskData(taskStore);

const Dal = {
  queueData,
  taskData
};

export { Dal };