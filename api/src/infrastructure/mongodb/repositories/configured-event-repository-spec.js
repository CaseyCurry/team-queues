/*eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]*/
import { expect } from "chai";
import { MongoClient } from "mongodb";
import { ConfiguredEventStore } from "../stores/configured-event-store";
import { ConfiguredEventRepository } from "./configured-event-repository";

describe("configured event repository suite", () => {
  let event;

  beforeEach(async () => {
    event = {
      name: "coffee-ordered",
      versions: []
    };
  });

  describe("unit test suite", () => {
    it("should create or update an event", async () => {
      const store = {
        getCollection: async () => {
          return {
            updateOne: async (filter, eventToUpdate, options) => {
              expect(filter._id)
                .to.equal(event.name);
              expect(eventToUpdate["$set"].name)
                .to.equal(event.name);
              expect(options.upsert)
                .to.equal(true);
              return new Promise((resolve) => {
                resolve();
              });
            },
            close: () => {}
          };
        }
      };
      const repository = ConfiguredEventRepository(store);
      await repository.createOrUpdate(event);
    });

    it("delete an event by name", async () => {
      const store = {
        getCollection: async () => {
          return {
            findOne: async (filter) => {
              expect(filter)
                .to.deep.equal({
                  _id: event.name,
                  isDeleted: false
                });
              return new Promise((resolve) => {
                resolve(event);
              });
            },
            updateOne: async (filter, object) => {
              expect(filter._id)
                .to.equal(event.name);
              expect(object["$set"].isDeleted)
                .to.equal(true);
              return new Promise((resolve) => {
                resolve();
              });
            },
            close: () => {}
          };
        }
      };
      const repository = ConfiguredEventRepository(store);
      await repository.deleteByName(event.name);
    });

    it("get all events that are not soft deleted", async () => {
      const store = {
        getCollection: async () => {
          return {
            find: (filter) => {
              expect(filter)
                .to.deep.equal({ isDeleted: false });
              return {
                toArray: () => {
                  return new Promise((resolve) => {
                    resolve([{ name: filter._id }]);
                  });
                }
              };
            },
            close: () => {}
          };
        }
      };
      const repository = ConfiguredEventRepository(store);
      const foundEvents = await repository.getAll();
      expect(foundEvents.length)
        .to.equal(1);
    });
  });

  describe("integration tests", () => {
    let repository;

    beforeEach(async () => {
      const dbLocation = "mongodb://localhost:27017";
      const dbName = "teamqueuestests";
      const store = ConfiguredEventStore(MongoClient, dbLocation, dbName);
      repository = ConfiguredEventRepository(store);
    });

    afterEach(async () => {
      await repository.deleteByName(event.name);
    });

    it("get all events", async () => {
      await repository.createOrUpdate(event);
      const foundEvents = await repository.getAll();
      expect(foundEvents.find((foundEvent) => foundEvent.name === event.name))
        .to.exist;
    });
  });
});