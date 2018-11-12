import { Lifecycle } from "../../../domain/aggregates/lifecycle";

const extendLifecycle = (lifecycle) => {
  // TODO: maybe move to aggregate
  const eventsInTriggers = lifecycle.triggersForItemCreation
    .map((trigger) => {
      return trigger.eventNames;
    })
    .reduce((x, y) => x.concat(y));
  const eventsInQueues = lifecycle.queues
    .map((queue) => {
      return queue.destinationsWhenEventOccurred;
    })
    .reduce((x, y) => x.concat(y), [])
    .map((trigger) => {
      return trigger.eventNames;
    })
    .reduce((x, y) => x.concat(y), []);
  const referencedEvents = eventsInTriggers.concat(eventsInQueues);
  return Object.assign({}, lifecycle, { _id: lifecycle.id, referencedEvents, isDeleted: false });
};

const LifecycleRepository = (store) => {
  return {
    create: async (lifecycle) => {
      const extendedLifecycle = extendLifecycle(lifecycle);
      const collection = await store.getCollection();
      await collection.insertOne(extendedLifecycle);
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
    getThoseListeningForEvent: async (eventName) => {
      const collection = await store.getCollection();
      const lifecycles = await collection
        .find({
          referencedEvents: eventName,
          isDeleted: false
        })
        .toArray();
      // const lifecycles = await collection
      //   .aggregate([{
      //     $lookup: {
      //       from: "items",
      //       localField: "_id",
      //       foreignField: "lifecycleId",
      //       as: "items"
      //     }
      //   }, {
      //     $addFields: {
      //       incompleteItemCount: {
      //         $size: {
      //           $filter: {
      //             input: "$items",
      //             as: "item",
      //             cond: { $eq: ["$$item.isComplete", false] }
      //           }
      //         }
      //       }
      //     }
      //   }, {
      //     $match: {
      //       $and: [{
      //         $expr: {
      //           $in: [eventName, "$referencedEvents"]
      //         }
      //       }, {
      //         isDeleted: false
      //       }],
      //       $or: [{
      //         $expr: {
      //           $gt: ["$incompleteItemCount", 0]
      //         }
      //       }, {
      //         isDeleted: false
      //       }]
      //     }
      //   }])
      //   .toArray();
      collection.close();
      return lifecycles.map((lifecycle) => new Lifecycle(lifecycle));
    }
  };
};

export { LifecycleRepository };