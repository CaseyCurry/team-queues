const TaskData = (store) => {
  return {
    create: async (taskToCreate, existingTasks, etag) => {
      const updates = existingTasks.map((task) => {
        return {
          replaceOne: {
            filter: { id: task.id },
            replacement: Object.assign({}, task, { etag })
          }
        };
      });
      const collection = await store.getCollection();
      await collection.bulkWrite(updates.concat([{
        insertOne: {
          document: Object.assign({}, taskToCreate, { etag })
        }
      }]));
    },
    delete: async (taskToDelete, existingTasks, etag) => {
      const updates = existingTasks.map((task) => {
        return {
          replaceOne: {
            filter: { id: task.id },
            replacement: Object.assign({}, task, { etag })
          }
        };
      });
      const collection = await store.getCollection();
      await collection.bulkWrite(updates.concat([{
        deleteOne: {
          filter: { id: taskToDelete.id }
        }
      }]));
    },
    getByItemId: async (itemId) => {
      const collection = await store.getCollection();
      const tasks = await collection.find({ "item.id": itemId })
        .toArray();
      collection.close();
      return tasks;
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
