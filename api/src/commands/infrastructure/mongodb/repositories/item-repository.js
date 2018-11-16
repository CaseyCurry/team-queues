import { Item } from "../../../domain/aggregates/item";

const ItemRepository = (store) => {
  return {
    createOrUpdate: async (item) => {
      const extendedItem = Object.assign({}, item, { _id: item.id });
      const collection = await store.getCollection();
      await collection.updateOne({
        _id: item.id
      }, {
        $set: extendedItem
      }, {
        upsert: true
      });
      collection.close();
    },
    getById: async (id) => {
      const collection = await store.getCollection();
      const item = await collection.findOne({ _id: id });
      collection.close();
      if (!item) {
        return;
      }
      return new Item(item);
    },
    getByForeignId: async (lifecycleId, foreignId) => {
      const collection = await store.getCollection();
      const item = await collection
        .findOne({
          lifecycleId: lifecycleId,
          foreignId: foreignId
        });
      collection.close();
      if (!item) {
        return;
      }
      return new Item(item);
    }
  };
};

export { ItemRepository };