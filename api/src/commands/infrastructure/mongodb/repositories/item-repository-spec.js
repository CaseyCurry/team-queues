import { expect } from "chai";
import { MongoClient } from "mongodb";
import { ItemStore } from "../stores/item-store";
import { ItemRepository } from "./item-repository";
import { v4 as uuidv4 } from "uuid";

describe("item repository suite", () => {
  let item;

  beforeEach(async () => {
    item = {
      id: uuidv4(),
      foreignId: 123
    };
  });

  describe("unit test suite", () => {
    it("should create or update an item", async () => {
      const store = {
        getCollection: async () => {
          return {
            updateOne: async (filter, itemToUpdate, options) => {
              expect(filter["_id"])
                .to.equal(item.id);
              expect(itemToUpdate["$set"].id)
                .to.equal(item.id);
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
      const repository = ItemRepository(store);
      await repository.createOrUpdate(item);
    });

    it("get an item by id", async () => {
      const store = {
        getCollection: async () => {
          return {
            findOne: async (filter) => {
              expect(filter["_id"])
                .to.equal(item.id);
              return new Promise((resolve) => {
                resolve({ id: filter["_id"] });
              });
            },
            close: () => {}
          };
        }
      };
      const repository = ItemRepository(store);
      const foundItem = await repository.getById(item.id);
      expect(foundItem)
        .to.exist;
    });

    it("get items by lifecycle id and foreign id", async () => {
      const lifecycleId = 1;
      const store = {
        getCollection: async () => {
          return {
            findOne: (filter) => {
              expect(filter)
                .to.deep.equal({
                  lifecycleId: lifecycleId,
                  foreignId: item.foreignId
                });
              return new Promise((resolve) => {
                resolve({ id: filter.lifecycleId });
              });
            },
            close: () => {}
          };
        }
      };
      const repository = ItemRepository(store);
      const foundItem = await repository.getByForeignId(lifecycleId, item.foreignId);
      expect(foundItem)
        .to.exist;
    });
  });

  describe("integration test suite", () => {
    let repository;

    beforeEach(async () => {
      const dbLocation = "mongodb://localhost:27017";
      const dbName = "teamqueuescommandstests";
      const store = ItemStore(MongoClient, dbLocation, dbName);
      repository = ItemRepository(store);
    });

    it("should insert an item into the data store", async () => {
      await repository.createOrUpdate(item);
      const createdItem = await repository.getById(item.id);
      expect(createdItem)
        .to.not.be.null;
    });
  });
});
