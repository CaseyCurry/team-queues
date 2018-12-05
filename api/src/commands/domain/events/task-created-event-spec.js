import { expect } from "chai";
import { TaskCreatedEvent as Event } from "./task-created-event";
import { Item } from "../aggregates/item";
import { Task } from "../entities/task";

describe("task created event suite", () => {
  const item = new Item({
    id: 456,
    foreignId: 789,
    lifecycleId: 987
  });
  const task = new Task({
    id: 123,
    itemId: item.id,
    queueName: "Barista Queue",
    type: "Make Coffee",
    createdOn: new Date(),
    status: "Completed",
    dueOn: new Date()
  });
  let event;

  beforeEach(() => {
    event = new Event(task, item);
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

  it("should include an etag", () => {
    expect(event.message.etag)
      .to.exist;
  });

  it("should include the task", () => {
    expect(event.message.task)
      .to.deep.equal({
        id: task.id,
        item: {
          id: item.id,
          foreignId: item.foreignId,
          lifecycleId: item.lifecycleId
        },
        queueName: task.queueName,
        type: task.type,
        createdOn: task.createdOn,
        status: task.status,
        dueOn: task.dueOn,
        assignee: undefined
      });
  });
});
