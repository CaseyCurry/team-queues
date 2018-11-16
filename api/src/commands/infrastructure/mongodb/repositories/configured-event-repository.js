import { ConfiguredEvent } from "../../../domain/aggregates/configured-event";

const ConfiguredEventRepository = (store) => {
  return {
    createOrUpdate: async (event) => {
      const extendedEvent = Object.assign({}, event, { _id: event.name, isDeleted: false });
      const collection = await store.getCollection();
      await collection.updateOne({
        _id: event.name
      }, {
        $set: extendedEvent
      }, {
        upsert: true
      });
      collection.close();
    },
    deleteByName: async (name) => {
      const collection = await store.getCollection();
      const event = await collection.findOne({
        _id: name,
        isDeleted: false
      });
      if (!event) {
        return;
      }
      await collection.updateOne({
        _id: event.name
      }, {
        $set: Object.assign({}, event, { isDeleted: true })
      });
      collection.close();
    },
    // TODO: unit test this
    getByName: async (name) => {
      const collection = await store.getCollection();
      const event = await collection.findOne({
        _id: name,
        isDeleted: false
      });
      return event ? new ConfiguredEvent(event) : null;
    },
    getAll: async () => {
      const collection = await store.getCollection();
      const events = await collection
        .find({ isDeleted: false })
        .toArray();
      collection.close();
      return events.map((event) => new ConfiguredEvent(event));
    }
  };
};

export { ConfiguredEventRepository };