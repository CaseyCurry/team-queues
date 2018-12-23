import { expect } from "chai";
import { UnconditionalDestination } from "./unconditional-destination";
import { Modification } from "./modification";

describe("unconditional destination suite", () => {
  describe("when a destination is created", () => {
    let unconditionalDestination;
    const queueName = "Barista Queue";
    const taskType = "Make Coffee";
    const modification = new Modification({ text: "dueOn + @minute(1)" });
    const doesCompletePreviousTask = true;

    beforeEach(() => {
      unconditionalDestination = new UnconditionalDestination({
        queueName,
        taskType,
        modification,
        doesCompletePreviousTask
      });
    });

    it("should include the queue name", () => {
      expect(unconditionalDestination.queueName).to.equal(queueName);
    });

    it("should include the task type", () => {
      expect(unconditionalDestination.taskType).to.equal(taskType);
    });

    it("should include the modification", () => {
      expect(unconditionalDestination.modification).to.deep.equal(modification);
    });

    it("should include the flag that indicates the previous task should be completed", () => {
      expect(unconditionalDestination.doesCompletePreviousTask).to.equal(
        doesCompletePreviousTask
      );
    });

    it("should be immutable", () => {
      expect(Object.isFrozen(unconditionalDestination)).to.equal(true);
    });
  });

  describe("when an attempt is made to create a destination with invalid arguments", () => {
    it("should throw an error if the queue name is null", () => {
      const queueName = null;
      const taskType = "Make Coffee";
      try {
        new UnconditionalDestination({
          queueName,
          taskType
        });
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("should throw an error if the task type is null", () => {
      const queueName = "Barista Queueu";
      const taskType = null;
      try {
        new UnconditionalDestination({
          queueName,
          taskType
        });
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
});
