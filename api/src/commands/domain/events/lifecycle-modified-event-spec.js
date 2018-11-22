import { expect } from "chai";
import { LifecycleModifiedEvent as Event } from "./lifecycle-modified-event";

describe("lifecycle modified event suite", () => {
  const lifecycle = {
    id: 123,
    lifecycleOf: "coffee",
    version: 1,
    status: "Active",
    queues: [{
      id: 456,
      name: "cashier-queue",
      taskType: "take-order"
    }]
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
      .to.equal("team-queues.lifecycle-modified");
  });

  it("should include the version", () => {
    expect(event.version)
      .to.equal(1);
  });

  xit("should include the correlation id", () => {
    expect(event.correlationId)
      .to.equal(999);
  });

  it("should include the lifecycle", () => {
    expect(event.message.lifecycle)
      .to.deep.equal({
        id: lifecycle.id,
        lifecycleOf: lifecycle.lifecycleOf,
        version: lifecycle.version,
        status: lifecycle.status,
        queues: lifecycle.queues.map((queue) => {
          return {
            id: queue.id,
            name: queue.name,
            taskType: queue.taskType
          };
        })
      });
  });
});
