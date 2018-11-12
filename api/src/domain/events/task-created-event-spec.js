import { expect } from "chai";
import { TaskCreatedEvent as Event } from "./task-created-event";
import { Task } from "../entities/task";

describe("task created event suite", () => {
  const task = new Task({
    id: 123,
    itemId: 456,
    queueId: 789,
    createdOn: new Date(),
    status: "Completed",
    dueOn: new Date()
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
      .to.equal("team-queues.task-created");
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
        id: task.id,
        itemId: task.itemId,
        queueId: task.queueId,
        createdOn: task.createdOn,
        status: task.status,
        dueOn: task.dueOn,
        assignee: undefined
      });
  });
});