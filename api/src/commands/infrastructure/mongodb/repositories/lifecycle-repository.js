import { Lifecycle } from "../../../domain/aggregates/lifecycle";

const LifecycleRepository = (store) => {
  return {
    createOrUpdate: async (lifecycle) => {
      const extendedLifecycle = Object.assign({}, lifecycle, {
        _id: lifecycle.id,
        isDeleted: false
      });
      const collection = await store.getCollection();
      await collection.updateOne({
        _id: extendedLifecycle.id
      }, {
        $set: extendedLifecycle
      }, {
        upsert: true
      });
      collection.close();
    },
    deleteById: async (id) => {
      const collection = await store.getCollection();
      const lifecycle = await collection.findOne({
        _id: id,
        isDeleted: false
      });
      if (!lifecycle) {
        return;
      }
      await collection.updateOne({
        _id: lifecycle.id
      }, {
        $set: Object.assign({}, lifecycle, { isDeleted: true })
      });
      collection.close();
    },
    getById: async (id) => {
      const collection = await store.getCollection();
      const lifecycle = await collection.findOne({
        _id: id,
        isDeleted: false
      });
      collection.close();
      if (!lifecycle) {
        return;
      }
      return new Lifecycle(lifecycle);
    },
    getAll: async () => {
      const collection = await store.getCollection();
      const lifecycles = await collection
        .find({ isDeleted: false })
        .toArray();
      collection.close();
      return lifecycles.map((lifecycle) => new Lifecycle(lifecycle));
    },
    getAllWithActiveVersion: async () => {
      // TODO: unit test
      const collection = await store.getCollection();
      const lifecycles = await collection
        .find({
          isDeleted: false,
          activeVersion: { $exists: true }
        })
        .toArray();
      collection.close();
      return lifecycles.map((lifecycle) => new Lifecycle(lifecycle));
    }
  };
};

export { LifecycleRepository };
