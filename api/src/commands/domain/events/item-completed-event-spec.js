import { expect } from "chai";
import { ItemCompletedEvent as Event } from "./item-completed-event";

describe("item completed event suite", () => {
  const item = {
    id: 123
  };
  let event;

  beforeEach(() => {
    event = new Event(item);
  });

  it("should include an id", () => {
    expect(event.id).to.exist;
  });

  it("should include the time it occurred", () => {
    expect(event.occurredOn).to.exist;
  });

  it("should include the name", () => {
    expect(event.name).to.equal("team-queues.item-completed");
  });

  it("should include the version", () => {
    expect(event.version).to.equal(1);
  });

  xit("should include the correlation id", () => {
    expect(event.correlationId).to.equal(999);
  });

  it("should include the item", () => {
    expect(event.message.item).to.deep.equal({
      id: item.id
    });
  });

  it("should be immutable", () => {
    expect(Object.isFrozen(event)).to.equal(true);
  });
});
