const QueueData = store => {
  return {
    createMany: async queues => {
      const collection = await store.getCollection();
      await collection.insertMany(queues);
      collection.close();
    },
    deleteByLifecycle: async lifecycleId => {
      const collection = await store.getCollection();
      await collection.deleteMany({ lifecycleId });
      collection.close();
    },
    getAll: async () => {
      const collection = await store.getCollection();
      const queues = await collection.find({}).toArray();
      collection.close();
      return queues;
    }
  };
};

export { QueueData };
