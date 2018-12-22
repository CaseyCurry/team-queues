import { ConfiguredEvent } from "../../domain/aggregates/configured-event";
import { EventInterface } from "../../domain/events/event";
import { DomainEvents } from "../../infrastructure/kafka/domain-events";
import { ItemRepository } from "../../infrastructure/mongodb/repositories/item-repository";
import { LifecycleRepository } from "../../infrastructure/mongodb/repositories/lifecycle-repository";
import { DestinationProcessor } from "../../domain/services/destination-processor";
import { ConfiguredEventRepository } from "../../infrastructure/mongodb/repositories/configured-event-repository";
import { DomainEventFilter } from "../../domain/services/domain-event-filter";
import { Lifecycle } from "../../domain/aggregates/lifecycle";

interface EventsAndLifecycles {
  configuredEvents: ConfiguredEvent[];
  lifecyclesWithAnActiveVersion: Lifecycle[];
}

// TODO: unit test
// TODO: enforce idempotency and test by changing the group id in the kafka consumer to confirm current state is respected
// TODO: the number of parameters makes me question whether this is doing too much
export class ConfiguredEventsHandler {
  private registeredEvents: string[] = [];
  private lifecycles: Lifecycle[] = [];

  constructor(
    private domainEvents: DomainEvents,
    private domainEventFilter: DomainEventFilter,
    private configuredEventRepository: ConfiguredEventRepository,
    private destinationProcessor: DestinationProcessor,
    private lifecycleRepository: LifecycleRepository,
    private itemRepository: ItemRepository
  ) {}

  public async register(): Promise<void> {
    const eventsAndLifecycles = await this.getEventsAndLifecycles();
    this.registerEvents(eventsAndLifecycles);
  }

  public async reregister(): Promise<void> {
    const eventsAndLifecycles = await this.getEventsAndLifecycles();
    /* Ingoring and re-registering needs to be synchronous. That's why getting data
       from the async repos is above this comment. If removing and re-subscribing is
       not done synchronously, events could occur while there are missing
       subscriptions in DomainEvents. */
    this.registeredEvents.forEach(eventName => {
      this.domainEvents.ignore(eventName);
    });
    this.registerEvents(eventsAndLifecycles);
    /* We're back to freely using async. */
    await this.domainEvents.start();
  }

  private registerEvents({
    configuredEvents,
    lifecyclesWithAnActiveVersion
  }: EventsAndLifecycles): void {
    this.lifecycles = lifecyclesWithAnActiveVersion;
    this.registeredEvents = [];
    configuredEvents.forEach(configuredEvent => {
      /* Passing the configured event here helps with performance b/c we don't
         have to query the db every time an event occurs. However, if someone
         changes the configured event aggregate, this instance will be stale.
         We listen for team-queues.configured-event-modified to re-register the
         handlers. */
      this.registerEvent(configuredEvent);
    });
  }

  private getLifecyclesListeningForEvent(eventName: string) {
    return this.lifecycles.filter(lifecycle =>
      lifecycle.referencedEvents.includes(eventName)
    );
  }

  private registerEvent(configuredEvent: ConfiguredEvent) {
    this.domainEvents.listenAndHandleOnce(
      configuredEvent.name,
      this.handler(configuredEvent)
    );
    this.registeredEvents.push(configuredEvent.name);
  }

  private async getEventsAndLifecycles(): Promise<EventsAndLifecycles> {
    const lifecyclesWithAnActiveVersion = await this.lifecycleRepository.getAllWithActiveVersion();
    const configuredEvents = await this.configuredEventRepository.getAllActive();
    return {
      lifecyclesWithAnActiveVersion,
      configuredEvents
    };
  }

  private handler(configuredEvent: ConfiguredEvent) {
    return async (event: EventInterface) => {
      // TODO: make sure this method handles multi-phase commits properly
      const context = configuredEvent.getContext(event);

      const lifecyclesListeningForEvent = this.getLifecyclesListeningForEvent(
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
        const item = await this.itemRepository.getByForeignId(
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
            this.destinationProcessor,
            event,
            configuredEvent,
            item
          );
          console.debug(
            `updating item ${item.id} in lifecycle of ${
              lifecycle.lifecycleOf
            } because of event ${event.name} having occurred`
          );
          // TODO: change this to not upsert if separating insert and update  will increase performance
          await this.itemRepository.createOrUpdate(updatedItem!);
          raisedDomainEvents.push(...updatedItem!.domainEvents.raisedEvents);
        } else {
          console.debug(
            `handling the occurred event ${event.name} in lifecycle of ${
              lifecycle.lifecycleOf
            }`
          );
          const createdItem = await lifecycle.processEvent(
            this.destinationProcessor,
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
            this.itemRepository.createOrUpdate(createdItem);
            raisedDomainEvents.push(...createdItem.domainEvents.raisedEvents);
          }
        }
        raisedDomainEvents.push(...lifecycle.domainEvents.raisedEvents);
        this.domainEventFilter.raise(raisedDomainEvents);
      }
    };
  }
}
