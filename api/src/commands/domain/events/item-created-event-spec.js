import { expect } from "chai";
import { ItemCreatedEvent as Event } from "./item-created-event";

describe("item created event suite", () => {
  const item = {
    id: 123,
    foreignId: 456,
    queueId: 789
  };
  let event;

  beforeEach(() => {
    event = new Event(item);
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
      .to.equal("team-queues.item-created");
  });

  it("should include the version", () => {
    expect(event.version)
      .to.equal(1);
  });

  xit("should include the correlation id", () => {
    expect(event.correlationId)
      .to.equal(999);
  });

  it("should include the item", () => {
    expect(event.message.item)
      .to.deep.equal({
        id: item.id,
        foreignId: item.foreignId,
        lifecycleId: item.lifecycleId
      });
  });

  it("should be immutable", () => {
    expect(Object.isFrozen(event))
      .to.equal(true);
  });
});
