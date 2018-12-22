import { expect } from "chai";
import kafka from "node-rdkafka";
import { DomainEvents } from "./domain-events";

describe("domain events suite", () => {
  describe("integration tests", function() {
    let domainEvents: DomainEvents;
    let eventName: string = "team-queues-tests.test-event";

    beforeEach(async () => {
      domainEvents = new DomainEvents(kafka);
      await domainEvents.initialize();
    });

    afterEach(() => {
      domainEvents.end();
    });

    // TODO: write better tests
    it("should test", done => {
      domainEvents.listenAndHandleOnce(eventName, event => {
        return new Promise(resolve => {
          resolve();
          expect(event.name).to.equal(eventName);
          done();
        });
      });
      domainEvents.start().then(() => {
        domainEvents.raise({
          name: eventName,
          occurredOn: new Date()
        });
      });
    });
  });
});
