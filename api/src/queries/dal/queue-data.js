const QueueData = (store) => {
  return {
    createMany: async (queues) => {
      const collection = await store.getCollection();
      await collection.insertMany(queues);
      collection.close();
    },
    deleteByLifecycle: async (lifecycleId) => {
      const collection = await store.getCollection();
      await collection.deleteMany({ lifecycleId });
      collection.close();
    },
    getAll: async () => {
      const collection = await store.getCollection();
      // select the queues that are either active or those with tasks in them
      const queues = await collection
        .aggregate([{
          $lookup: {
            from: "tasks",
            localField: "lifecycleId",
            foreignField: "item.lifecycleId",
            as: "tasks"
          }
        }, {
          $addFields: {
            countOfActives: { $cond: ["$isLifecycleActive", 1, 0] }
          }
        }, {
          $group: {
            _id: { queueName: "$queueName", taskType: "$taskType" },
            taskCount: { $sum: { $size: "$tasks" } },
            isActive: { $sum: "$countOfActives" }
          }
        }, {
          $match: { $or: [{ taskCount: { $gt: 0 } }, { isActive: { $gt: 0 } }] }
        }])
        .toArray();
      collection.close();
      return queues.map((queue) => queue["_id"]);
    },
    getTasks: async (queueName, taskType) => {
      /* TODO: The will be a performance concern if the inactive queues are not cleaned up.
         They will continue to increase the memory/compute requirements of this query.
         Clean up empty and inactive queues during the re-versioning of items. */
      const collection = await store.getCollection();
      const tasks = await collection
        .aggregate([{
          $lookup: {
            from: "tasks",
            let: {
              lifecycleId: "$item.lifecycleId",
              queueId: "$queueId"
            },
            pipeline: [{
              $match: {
                $expr: {
                  $and: [{
                    $eq: [
                      "$queueId",
                      "$$queueId"
                    ]
                  }, {
                    $eq: [
                      "$lifecycleId",
                      "$$lifecycleId"
                    ]
                  }]
                }
              }
            }],
            as: "tasks"
          }
        }, {
          $match: { queueName, taskType }
        }, {
          $unwind: { path: "$tasks" }
        }, {
          $replaceRoot: { newRoot: "$tasks" }
        }])
        .toArray();
      collection.close();
      return tasks;
    }
  };
};

export { QueueData };
