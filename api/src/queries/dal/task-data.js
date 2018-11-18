const TaskData = (store) => {
  return {
    create: async (task) => {
      const collection = await store.getCollection();
      await collection.insertOne(task);
      collection.close();
    },
    deleteId: async (id) => {
      const collection = await store.getCollection();
      await collection.deleteOne({ id });
      collection.close();
    },
    getById: async (id) => {
      const collection = await store.getCollection();
      const task = await collection.findOne({ id });
      collection.close();
      return task;
    },
    getByQueueId: async (queueId) => {
      const collection = await store.getCollection();
      const queues = await collection.find({ queueId })
        .toArray();
      collection.close();
      return queues;
    }
  };
};

export { TaskData };