import { expect } from "chai";
import { TaskStatus } from "./task-status";

describe("task status suite", () => {
  it("should allow the Unassigned state", () => {
    expect(TaskStatus.Unassigned)
      .to.equal("Unassigned");
  });

  it("should allow the Assigned state", () => {
    expect(TaskStatus.Assigned)
      .to.equal("Assigned");
  });

  it("should allow the Completed state", () => {
    expect(TaskStatus.Completed)
      .to.equal("Completed");
  });

  it("should be immutable", () => {
    expect(Object.isFrozen(TaskStatus))
      .to.equal(true);
  });
});
