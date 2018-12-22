import { name as taskCreatedEventName } from "../events/task-created-event";
import { DomainEvents } from "../../infrastructure/kafka/domain-events";
import { ClientNotifications } from "../../infrastructure/socketio/client-notifications";
import { EventInterface } from "../events/event";

// TODO: unit test
export class DomainEventFilter {
  // TODO: make these configurable by a lifecycle designer
  private highVisibilityEvents = [taskCreatedEventName];

  constructor(
    private domainEvents: DomainEvents,
    private clientNotifications: ClientNotifications
  ) {}

  public raise(events: EventInterface[] | EventInterface): void {
    if (events && !Array.isArray(events)) {
      events = [events];
    }
    if (!events || !Array.isArray(events) || !events.length) {
      return;
    }
    this.raiseEvents(events);
  }

  private raiseEvents(events: EventInterface[]) {
    // make sure events are sent in the order of occurrence
    const sortedEvents = events
      .slice()
      .sort((x, y) => x.occurredOn.getTime() - y.occurredOn.getTime());
    sortedEvents.forEach(event => {
      this.domainEvents.raise(event);
      if (this.highVisibilityEvents.includes(event.name)) {
        this.clientNotifications.send(event.name, event);
      }
    });
  }
}
