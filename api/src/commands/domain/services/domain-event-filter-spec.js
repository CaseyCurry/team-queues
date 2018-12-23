import { expect } from "chai";
import { DomainEventFilter } from "./domain-event-filter";

describe("domain event filter suite", () => {
  describe("when one event is raised", () => {
    describe("when the event is recognized as a high visibility one", () => {
      const event = {
        name: "team-queues.task-created"
      };

      it("should raise one event", () => {
        let counter = 0;
        const domainEvents = {
          raise: () => {
            counter++;
          }
        };
        const clientNotifications = {
          send: () => {}
        };
        const domainEventFilter = DomainEventFilter(
          domainEvents,
          clientNotifications
        );
        domainEventFilter.raise(event);
        expect(counter).to.equal(1);
      });

      it("should raise the exact domain event", () => {
        const domainEvents = {
          raise: eventArg => {
            expect(eventArg).to.equal(event);
          }
        };
        const clientNotifications = {
          send: () => {}
        };
        const domainEventFilter = DomainEventFilter(
          domainEvents,
          clientNotifications
        );
        domainEventFilter.raise(event);
      });

      it("should send a notification", () => {
        const domainEvents = {
          raise: () => {}
        };
        const clientNotifications = {
          send: (channel, message) => {
            expect(message).to.equal(event);
          }
        };
        const domainEventFilter = DomainEventFilter(
          domainEvents,
          clientNotifications
        );
        domainEventFilter.raise(event);
      });
    });

    describe("when the event is recognized as a high visibility one", () => {
      const event = {
        name: "team-queues.task-assigned"
      };

      it("should not send a notification", () => {
        const domainEvents = {
          raise: () => {}
        };
        let counter = 0;
        const clientNotifications = {
          send: () => {
            counter++;
          }
        };
        const domainEventFilter = DomainEventFilter(
          domainEvents,
          clientNotifications
        );
        domainEventFilter.raise(event);
        expect(counter).to.equal(0);
      });
    });
  });

  describe("when two events are raised", () => {
    const events = [
      {
        name: "team-queues.second-task-created",
        occurredOn: new Date()
      },
      {
        name: "team-queues.first-task-created",
        occurredOn: new Date(new Date().getTime() - 30 * 60000)
      }
    ];
    const clientNotifications = {
      send: () => {}
    };

    it("should raise two events", () => {
      let counter = 0;
      const domainEvents = {
        raise: () => {
          counter++;
        }
      };
      const domainEventFilter = DomainEventFilter(
        domainEvents,
        clientNotifications
      );
      domainEventFilter.raise(events);
      expect(counter).to.equal(2);
    });

    it("should raise the events in order of occurrence", () => {
      let isFirstEvent = true;
      const domainEvents = {
        raise: eventArg => {
          if (isFirstEvent) {
            expect(eventArg.name).to.equal("team-queues.first-task-created");
            isFirstEvent = false;
          }
        }
      };
      const domainEventFilter = DomainEventFilter(
        domainEvents,
        clientNotifications
      );
      domainEventFilter.raise(events);
    });
  });

  describe("when zero events are raised", () => {
    it("should not raise events", () => {
      let counter = 0;
      const domainEvents = {
        raise: () => {
          counter++;
        }
      };
      const events = [];
      const clientNotifications = {
        send: () => {}
      };
      const domainEventFilter = DomainEventFilter(
        domainEvents,
        clientNotifications
      );
      domainEventFilter.raise(events);
      expect(counter).to.equal(0);
    });
  });
});
