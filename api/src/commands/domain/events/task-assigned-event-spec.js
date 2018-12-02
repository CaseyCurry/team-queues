import { expect } from "chai";
import { TaskAssignedEvent as Event } from "./task-assigned-event";
import { Task } from "../entities/task";

describe("task assigned event suite", () => {
  const task = new Task({
    itemId: 456,
    id: 123,
    assignee: { name: "Jane" }
  });
  let event;

  beforeEach(() => {
    event = new Event(task);
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
      .to.equal("team-queues.task-assigned");
  });

  it("should include the version", () => {
    expect(event.version)
      .to.equal(1);
  });

  xit("should include the correlation id", () => {
    expect(event.correlationId)
      .to.equal(999);
  });

  it("should include the task", () => {
    expect(event.message.task)
      .to.deep.equal({
        itemId: task.itemId,
        id: task.id,
        assigneeName: task.assignee.name
      });
  });
});
