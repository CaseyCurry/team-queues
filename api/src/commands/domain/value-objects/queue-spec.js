import { expect } from "chai";
import { Queue } from "./queue";
import { UnconditionalDestination } from "./unconditional-destination";
import { TriggeredDestination } from "./triggered-destination";

describe("queue suite", () => {
  describe("when a queue is created", () => {
    let queue;
    const name = "Cashier Queue";
    const taskType = "Take Order";
    const destinationsWhenTaskCreated = [
      new UnconditionalDestination({
        queueName: "Barista Queue",
        taskType: "Make Coffee"
      })
    ];
    const destinationsWhenTaskCompleted = [
      new UnconditionalDestination({
        queueName: "Barista Queue",
        taskType: "Make Coffee"
      })
    ];
    const destinationsWhenEventOccurred = [
      new TriggeredDestination({
        eventNames: ["building.store-closing"],
        destinations: [
          new UnconditionalDestination({
            queueName: "Barista Queue",
            taskType: "Cleanup Station"
          })
        ]
      })
    ];

    beforeEach(() => {
      queue = new Queue({
        name,
        taskType,
        destinationsWhenTaskCreated,
        destinationsWhenTaskCompleted,
        destinationsWhenEventOccurred
      });
    });

    it("should include the queue name", () => {
      expect(queue.name)
        .to.equal(name);
    });

    it("should include the task type", () => {
      expect(queue.taskType)
        .to.equal(taskType);
    });

    it("should include the destinations when task created", () => {
      expect(queue.destinationsWhenTaskCreated)
        .to.deep.equal(destinationsWhenTaskCreated);
    });

    it("should include the destinations when task completed", () => {
      expect(queue.destinationsWhenTaskCompleted)
        .to.deep.equal(destinationsWhenTaskCompleted);
    });

    it("should include the destinations when an event occurs", () => {
      expect(queue.destinationsWhenEventOccurred)
        .to.deep.equal(destinationsWhenEventOccurred);
    });

    it("should be immutable", () => {
      expect(Object.isFrozen(queue))
        .to.equal(true);
    });
  });

  describe("when an attempt is made to create a queue with invalid arguments", () => {
    it("should throw an error if the name is null", () => {
      const name = null;
      const taskType = "Take Order";
      const destinationsWhenTaskCreated = [];
      const destinationsWhenTaskCompleted = [];
      const destinationsWhenEventOccurred = [];
      try {
        new Queue({
          name,
          taskType,
          destinationsWhenTaskCreated,
          destinationsWhenTaskCompleted,
          destinationsWhenEventOccurred
        });
      } catch (error) {
        expect(error)
          .to.exist;
      }
    });

    it("should throw an error if the task type is null", () => {
      const name = "Cashier Queue";
      const taskType = null;
      const destinationsWhenTaskCreated = [];
      const destinationsWhenTaskCompleted = [];
      const destinationsWhenEventOccurred = [];
      try {
        new Queue({
          name,
          taskType,
          destinationsWhenTaskCreated,
          destinationsWhenTaskCompleted,
          destinationsWhenEventOccurred
        });
      } catch (error) {
        expect(error)
          .to.exist;
      }
    });
  });
});
