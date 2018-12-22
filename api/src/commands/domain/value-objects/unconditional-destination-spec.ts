import { expect } from "chai";
import { UnconditionalDestination } from "./unconditional-destination";
import { Modification } from "./modification";

describe("unconditional destination suite", () => {
  describe("when a destination is created", () => {
    let unconditionalDestination: UnconditionalDestination;
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
});
