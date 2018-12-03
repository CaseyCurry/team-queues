import { expect } from "chai";
import { MongoClient } from "mongodb";
import { Lifecycle } from "../../../domain/aggregates/lifecycle";
import { LifecycleVersion } from "../../../domain/entities/lifecycle-version";
import { LifecycleStore } from "../stores/lifecycle-store";
import { LifecycleRepository } from "./lifecycle-repository";
import { v4 as uuidv4 } from "uuid";

describe("lifecycle repository suite", () => {
  let lifecycle;

  beforeEach(async () => {
    lifecycle = new Lifecycle({
      id: uuidv4(),
      lifecycleOf: "coffee",
      activeVersion: new LifecycleVersion({
        number: 1,
        triggersForItemCreation: [],
        queues: []
      })
    });
  });

  describe("unit test suite", () => {
    it("should upsert a lifecycle with an _id", async () => {
      const store = {
        getCollection: async () => {
          return {
            updateOne: async (filter, lifecycleToUpdate, options) => {
              expect(filter["_id"])
                .to.equal(lifecycle.id);
              expect(lifecycleToUpdate["$set"].id)
                .to.equal(lifecycle.id);
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
      const repository = LifecycleRepository(store);
      await repository.createOrUpdate(lifecycle);
    });

    it("delete a lifecycle by id", async () => {
      const store = {
        getCollection: async () => {
          return {
            findOne: async (filter) => {
              expect(filter)
                .to.deep.equal({
                  _id: lifecycle.id,
                  isDeleted: false
                });
              return new Promise((resolve) => {
                resolve(lifecycle);
              });
            },
            updateOne: async (filter, object) => {
              expect(filter["_id"])
                .to.equal(lifecycle.id);
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
      const repository = LifecycleRepository(store);
      await repository.deleteById(lifecycle.id);
    });

    it("get a lifecycle by id", async () => {
      const store = {
        getCollection: async () => {
          return {
            findOne: async (filter) => {
              expect(filter["_id"])
                .to.equal(lifecycle.id);
              return new Promise((resolve) => {
                resolve(lifecycle);
              });
            },
            close: () => {}
          };
        }
      };
      const repository = LifecycleRepository(store);
      const foundLifecycle = await repository
        .getById(lifecycle.id);
      expect(foundLifecycle)
        .to.not.be.null;
    });
  });

  describe("integration test suite", () => {
    const dbLocation = "mongodb://localhost:27017";
    const dbName = "teamqueuescommandstests";
    let lifecycleRepository;
    const eventName = "coffee-ordered";

    before(async () => {
      // TODO: replace this with dropping the db whenever the run starts
      // remove any residue left from previous tests
      const store = LifecycleStore(MongoClient, dbLocation, dbName);
      const collection = await store.getCollection();
      await collection.deleteMany({});
      collection.close();
    });

    beforeEach(async () => {
      const lifecycleStore = LifecycleStore(MongoClient, dbLocation, dbName);
      lifecycleRepository = LifecycleRepository(lifecycleStore);
      lifecycle = {
        id: uuidv4(),
        lifecycleOf: "coffee",
        activeVersion: new LifecycleVersion({
          number: 1,
          triggersForItemCreation: [{
            eventNames: [eventName],
            destinations: []
          }],
          queues: []
        })
      };
    });

    afterEach(async () => {
      await lifecycleRepository.deleteById(lifecycle.id);
    });

    it("should insert a lifecycle into the data store", async () => {
      await lifecycleRepository.createOrUpdate(lifecycle);
      const createdLifecycle = await lifecycleRepository
        .getById(lifecycle.id);
      expect(createdLifecycle)
        .to.exist;
    });
  });
});
