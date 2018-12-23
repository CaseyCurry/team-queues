// TODO: unit test
// TODO: enforce idempotency and test by changing the group id in the kafka consumer to confirm current state is respected
// TODO: the number of parameters makes me question whether this is doing too much
const ConfiguredEventsHandler = (
  domainEvents,
  domainEventFilter,
  configuredEventRepository,
  destinationProcessor,
  lifecycleRepository,
  itemRepository
) => {
  const handler = configuredEvent => {
    return async event => {
      // TODO: make sure this method handles multi-phase commits properly
      const context = configuredEvent.getContext(event);

      const lifecyclesListeningForEvent = getLifecyclesListeningForEvent(
        event.name
      );
      if (!lifecyclesListeningForEvent.length) {
        console.warn(
          `there are not any lifecycles listening for the ${
            event.name
          } event - consider inactivating configured event`
        );
        return;
      }

      const raisedDomainEvents = [];

      for (const lifecycle of lifecyclesListeningForEvent) {
        /* I can't imagine multiple lifecycles would listen to the same event, so lifecyclesListeningForEvent.length
           should generally be 1 at the most. Otherwise querying the db in a loop would be a
           performance concern. */
        /* TODO: Consider enforcing the above statement through code and lose this loop.
           Do not do this is there is a chance multiple lifecycles will need to handle a common
           event. If we enforce this invariant here we don't want to force domain's to publish
           two seperate events that logically represent one domain event just to get around our
           rules. */
        const item = await itemRepository.getByForeignId(
          lifecycle.id,
          context.foreignId
        );
        if (item && item.isComplete) {
          console.warn(
            `skipping completed item ${item.id} in lifecycle of ${
              lifecycle.lifecycleOf
            } because the ${event.name} event occurred`
          );
          continue;
        }
        if (item) {
          console.debug(
            `handling ${event.name} for item ${item.id} in lifecycle of ${
              lifecycle.lifecycleOf
            }`
          );
          const updatedItem = await lifecycle.processEvent(
            destinationProcessor,
            event,f
            configuredEvent,
            item
          );
          console.debug(
            `updating item ${item.id} in lifecycle of ${
              lifecycle.lifecycleOf
            } because of event ${event.name} having occurred`
          );
          // TODO: change this to not upsert if separating insert and update  will increase performance
          await itemRepository.createOrUpdate(updatedItem);
          raisedDomainEvents.push(...updatedItem.domainEvents.raisedEvents);
        } else {
          console.debug(
            `handling the occurred event ${event.name} in lifecycle of ${
              lifecycle.lifecycleOf
            }`
          );
          const createdItem = await lifecycle.processEvent(
            destinationProcessor,
            event,
            configuredEvent
          );
          if (!createdItem) {
            console.debug(
              `an item was not created in lifecycle of ${
                lifecycle.lifecycleOf
              } because of event ${event.name} having occurred`
            );
          } else {
            itemRepository.createOrUpdate(createdItem);
            raisedDomainEvents.push(...createdItem.domainEvents.raisedEvents);
          }
        }
        raisedDomainEvents.push(...lifecycle.domainEvents.raisedEvents);
        domainEventFilter.raise(raisedDomainEvents);
      }
    };
  };

  let registeredEvents = [];
  let lifecycles = [];

  const getLifecyclesListeningForEvent = eventName => {
    return lifecycles.filter(lifecycle =>
      lifecycle.referencedEvents.includes(eventName)
    );
  };

  const registerEvent = configuredEvent => {
    domainEvents.listenAndHandleOnce(
      configuredEvent.name,
      handler(configuredEvent)
    );
    registeredEvents.push(configuredEvent.name);
  };

  const register = ({ configuredEvents, lifecyclesWithAnActiveVersion }) => {
    lifecycles = lifecyclesWithAnActiveVersion;
    registeredEvents = [];
    configuredEvents.forEach(configuredEvent => {
      /* Passing the configured event here helps with performance b/c we don't
         have to query the db every time an event occurs. However, if someone
         changes the configured event aggregate, this instance will be stale.
         We listen for team-queues.configured-event-modified to re-register the
         handlers. */
      registerEvent(configuredEvent);
    });
  };

  const getEventsAndLifecycles = async () => {
    const lifecyclesWithAnActiveVersion = await lifecycleRepository.getAllWithActiveVersion();
    const configuredEvents = await configuredEventRepository.getAllActive();
    return {
      lifecyclesWithAnActiveVersion,
      configuredEvents
    };
  };

  return {
    register: async () => {
      register(await getEventsAndLifecycles());
    },
    reregister: async () => {
      const eventsAndLifecycles = await getEventsAndLifecycles();
      /* Ingoring and re-registering needs to be synchronous. That's why getting data
         from the async repos is above this comment. If removing and re-subscribing is
         not done synchronously, events could occur while there are missing
         subscriptions in DomainEvents. */
      registeredEvents.forEach(eventName => {
        domainEvents.ignore(eventName);
      });
      register(eventsAndLifecycles);
      /* We're back to freely using async. */
      await domainEvents.start();
    }
  };
};

export { ConfiguredEventsHandler };
