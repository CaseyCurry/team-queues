import { Lifecycle } from "../../../domain/aggregates/lifecycle";

const extendLifecycle = (lifecycle) => {
  // TODO: maybe move to aggregate
  let referencedEvents = [];
  if (lifecycle.activeVersion) {
    const eventsInTriggers = lifecycle.activeVersion.triggersForItemCreation
      .map((trigger) => {
        return trigger.eventNames;
      })
      .reduce((x, y) => x.concat(y), []);
    const eventsInQueues = lifecycle.activeVersion.queues
      .map((queue) => {
        return queue.destinationsWhenEventOccurred;
      })
      .reduce((x, y) => x.concat(y), [])
      .map((trigger) => {
        return trigger.eventNames;
      })
      .reduce((x, y) => x.concat(y), []);
    // get distinct events
    referencedEvents = eventsInTriggers
      .concat(eventsInQueues)
      .filter((x, y, z) => z.indexOf(x) === y);
  }
  return Object.assign({}, lifecycle, {
    _id: lifecycle.id,
    referencedEvents,
    isDeleted: false
  });
};

const LifecycleRepository = (store) => {
  return {
    createOrUpdate: async (lifecycle) => {
      const extendedLifecycle = extendLifecycle(lifecycle);
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
    getThoseListeningForEvent: async (eventName) => {
      const collection = await store.getCollection();
      const lifecycles = await collection
        .find({
          referencedEvents: eventName,
          isDeleted: false
        })
        .toArray();
      collection.close();
      return lifecycles.map((lifecycle) => new Lifecycle(lifecycle));
    }
  };
};

export { LifecycleRepository };
