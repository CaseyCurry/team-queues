const ConfiguredDomainEventHandler = (domainEvents, configuredEventRepository, destinationProcessor, lifecycleRepository, itemRepository) => {
  const handler = (configuredEvent) => {
    return async (event) => {
      // TODO: make sure this method handles multi-phase commits properly
      const context = configuredEvent.getContext(event);

      // TODO: there needs to be a way to deactivate old verions so performance doesn't degrade; probably part of the re-versioning process of items
      const lifecycles = await lifecycleRepository
        .getThoseListeningForEvent(event.name);
      if (!lifecycles.length) {
        console.debug(`there are not any lifecycles listening for the ${event.name} event`);
        return;
      }

      for (const lifecycle of lifecycles) {
        /* I can't imagine multiple lifecycles would listen to the same event, so lifecycles.length
           should generally be 1 at the most. Otherwise querying the db in a loop would be a
           performance concern. */
        /* TODO: Consider enforcing the above statement through code and lose this loop.
           Do not do this is there is a chance multiple lifecycles will need to handle a common
           event. If we enforce this invariant here we don't want to force domain's to publish
           two seperate events that logically represent one domain event just to get around our
           rules. */
        const item = await itemRepository.getByForeignId(lifecycle.id, context.foreignId);
        if (item && item.isComplete) {
          console.debug(`skipping completed item ${item.id} in lifecycle of ${lifecycle.lifecycleOf} because the ${event.name} event occurred`);
          continue;
        }
        if (item) {
          console.debug(`handling item ${item.id} in lifecycle of ${lifecycle.lifecycleOf} because the ${event.name} event occurred`);
          const updatedItem = await lifecycle
            .processEvent(destinationProcessor, event, configuredEvent, item);
          console.debug(`updating item ${item.id} in lifecycle of ${lifecycle.lifecycleOf} because of event ${event.name} having occurred`);
          // TODO: change this to not upsert if separating insert and update  will increase performance
          await itemRepository.createOrUpdate(updatedItem);
          domainEvents.raise(updatedItem.domainEvents.raisedEvents);
        } else {
          console.debug(`handling the occurred event ${event.name} in lifecycle of ${lifecycle.lifecycleOf}`);
          const createdItem = await lifecycle
            .processEvent(destinationProcessor, event, configuredEvent);
          if (!createdItem) {
            console.debug(`an item was not created in lifecycle of ${lifecycle.lifecycleOf} because of event ${event.name} having occurred`);
            return;
          }
          itemRepository.createOrUpdate(createdItem);
          domainEvents.raise(createdItem.domainEvents.raisedEvents);
        }
        domainEvents.raise(lifecycle.domainEvents.raisedEvents);
      }
    };
  };

  return {
    register: async () => {
      const configuredEvents = await configuredEventRepository.getActive();
      configuredEvents.forEach((configuredEvent) => {
        /* TODO: Passing the configured event here helps with performance b/c
           we don't have to query the db every time an event occurs.
           However, if someone changes the configured event aggregate, this
           instance will be stale. Listen for the team-queues.event-configured event
           to update the handler. */
        // TODO: do something similar for lifecycles considering they don't change often
        domainEvents.listenAndHandleOnce(configuredEvent.name, handler(configuredEvent));
      });
    }
  };
};

export { ConfiguredDomainEventHandler };
