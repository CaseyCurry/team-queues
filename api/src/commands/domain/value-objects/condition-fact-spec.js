import { expect } from "chai";
import { ConditionFact } from "./condition-fact";
import { Task } from "../entities/task";
import { TaskStatus } from "./task-status";

describe("condition fact suite", () => {
  describe("when a fact is created", () => {
    let conditionFact;
    const eventContext = {
      foreignId: 123
    };
    const currentTask = new Task({
      id: 456,
      createdOn: new Date(),
      status: TaskStatus.Assigned,
      dueOn: new Date()
    });

    beforeEach(() => {
      conditionFact = new ConditionFact(eventContext, currentTask);
    });

    it("should include the event context", () => {
      expect(conditionFact["@event"])
        .to.equal(eventContext);
    });

    it("should include the task's created on date", () => {
      expect(conditionFact["@currentTask"].createdOn)
        .to.equal(currentTask.createdOn);
    });

    it("should include the task's status", () => {
      expect(conditionFact["@currentTask"].status)
        .to.equal(currentTask.status);
    });

    it("should include the task's due on date", () => {
      expect(conditionFact["@currentTask"].dueOn)
        .to.equal(currentTask.dueOn);
    });

    it("should be immutable", () => {
      expect(Object.isFrozen(conditionFact))
        .to.equal(true);
    });
  });

  describe("when a current task is not provided", () => {
    it("should include the event context", () => {
      const eventContext = {
        foreignId: 123
      };
      const currentTask = null;
      const conditionFact = new ConditionFact(eventContext, currentTask);
      expect(conditionFact["@event"])
        .to.equal(eventContext);
    });
  });

  describe("when an attempt is made to create a fact with invalid arguments", () => {
    it("should throw an error if the event context is null", () => {
      const eventContext = null;
      const currentTask = new Task({
        id: 456,
        createdOn: new Date(),
        status: TaskStatus.Assigned,
        dueOn: new Date()
      });
      try {
        new ConditionFact(eventContext, currentTask);
      } catch (error) {
        expect(error)
          .to.exist;
      }
    });
  });
});
