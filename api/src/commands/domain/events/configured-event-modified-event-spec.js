import { expect } from "chai";
import { ConfiguredEventModifiedEvent as Event } from "./configured-event-modified-event";

describe("configured event modified event suite", () => {
  const configuredEvent = {
    name: "coffee-ordered"
  };
  let event;

  beforeEach(() => {
    event = new Event(configuredEvent);
  });

  it("should include an id", () => {
    expect(event.id)
      .to.exist;
  });

  it("should include the time it occurred", () => {
    expect(event.occurredOn)
      .to.exist;
  });

  it("should include the name", () => {
    expect(event.name)
      .to.equal("team-queues.configured-event-modified");
  });

  xit("should include the correlation id", () => {
    expect(event.correlationId)
      .to.equal(999);
  });

  it("should include the name", () => {
    expect(event.message.lifecycle)
      .to.deep.equal({
        name: configuredEvent.name
      });
  });

  it("should be immutable", () => {
    expect(Object.isFrozen(event))
      .to.equal(true);
  });
});
