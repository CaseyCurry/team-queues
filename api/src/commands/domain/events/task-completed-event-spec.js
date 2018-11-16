import { expect } from "chai";
import { TaskCompletedEvent as Event } from "./task-completed-event";
import { Task } from "../entities/task";

describe("task completed event suite", () => {
  const task = new Task({
    id: 123
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
      .to.equal("team-queues.task-completed");
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
        id: task.id
      });
  });
});