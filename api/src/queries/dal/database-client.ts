import { MongoClient, Collection } from "mongodb";
import { DatabaseClient as CommandDatabaseClient } from "../../commands/infrastructure/mongodb/stores/database-client";

/* This should make it easy to separate the read model into a separate install
   is scalability requires it. */
// TODO: consider doing something similar with DomainEvents
export class DatabaseClient extends CommandDatabaseClient {}
