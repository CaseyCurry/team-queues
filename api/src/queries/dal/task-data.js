const TaskData = (store) => {
  return {
    create: async (task) => {
      const collection = await store.getCollection();
      await collection.insertOne(task);
      collection.close();
    },
    deleteById: async (itemId, taskId) => {
      const collection = await store.getCollection();
      await collection.deleteOne({ id: taskId, "item.id": itemId });
      collection.close();
    },
    getById: async (itemId, taskId) => {
      const collection = await store.getCollection();
      const task = await collection.findOne({ id: taskId, "item.id": itemId });
      collection.close();
      return task;
    },
    getByQueue: async (queueName, type) => {
      const collection = await store.getCollection();
      const tasks = await collection.find({ queueName, type })
        .toArray();
      collection.close();
      return tasks;
    }
  };
};

export { TaskData };
