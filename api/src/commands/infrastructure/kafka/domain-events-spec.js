import { expect } from "chai";
import kafka from "node-rdkafka";
import { DomainEvents } from "./domain-events";

describe("domain events suite", () => {
  describe("integration tests", () => {
    let domainEvents;
    let eventName = "team-queues-tests.test-event";

    beforeEach(done => {
      DomainEvents(kafka).then(result => {
        domainEvents = result;
        done();
      });
    });

    afterEach(() => {
      domainEvents.end();
    });

    // TODO: write better tests
    it("should test", done => {
      domainEvents.listenAndHandleOnce(eventName, async event => {
        expect(event.name).to.equal(eventName);
        done();
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
