import { expect } from "chai";
import { LifecycleVersionActivatedEvent as Event } from "./lifecycle-version-activated-event";

describe("lifecycle version activated event suite", () => {
  const lifecycle = {
    id: 123,
    lifecycleOf: "coffee",
    activeVersion: {
      version: 1,
      queues: [{
        name: "cashier-queue",
        taskType: "take-order"
      }]
    }
  };
  let event;

  beforeEach(() => {
    event = new Event(lifecycle);
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
      .to.equal("team-queues.lifecycle-version-activated");
  });

  xit("should include the correlation id", () => {
    expect(event.correlationId)
      .to.equal(999);
  });

  it("should include the version", () => {
    expect(event.message.lifecycle)
      .to.deep.equal({
        id: lifecycle.id,
        lifecycleOf: lifecycle.lifecycleOf,
        version: {
          number: lifecycle.activeVersion.number,
          queues: lifecycle.activeVersion.queues.map((queue) => {
            return {
              name: queue.name,
              taskType: queue.taskType
            };
          })
        }
      });
  });

  it("should be immutable", () => {
    expect(Object.isFrozen(event))
      .to.equal(true);
  });
});
