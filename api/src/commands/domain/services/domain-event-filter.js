import { name as taskCreatedEventName } from "../events/task-created-event";

// TODO: make these configurable by a lifecycle designer
const highVisibilityEvents = [taskCreatedEventName];

// TODO: unit test
const DomainEventFilter = (domainEvents, clientNotifications) => {
  return {
    raise: (events) => {
      if (events && !Array.isArray(events)) {
        events = [events];
      }
      if (!events || !Array.isArray(events) || !events.length) {
        return;
      }
      raiseEvents(domainEvents, clientNotifications, events);
    }
  };
};

const raiseEvents = (domainEvents, clientNotifications, events) => {
  // make sure events are sent in the order of occurrence
  const sortedEvents = events
    .slice()
    .sort((x, y) => x.occurredOn - y.occurredOn);
  sortedEvents
    .forEach((event) => {
      domainEvents.raise(event);
      if (highVisibilityEvents.includes(event.name)) {
        clientNotifications.send(event.name, event);
      }
    });
};

export { DomainEventFilter };
