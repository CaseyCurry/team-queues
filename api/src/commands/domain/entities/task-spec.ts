import { expect } from "chai";
import { Task } from "./task";
import { TaskStatus } from "../value-objects/task-status";
import { TeamMember } from "../value-objects/team-member";

describe("task suite", () => {
  describe("when a task is created", () => {
    let task;
    const id = 123;
    const itemId = 456;
    const queueName = "Barista Queue";
    const type = "Make Coffee";
    const createdOn = new Date();
    const status = TaskStatus.Assigned;
    const dueOn = new Date();
    const assignee = new TeamMember({ name: "Jane" });

    beforeEach(() => {
      task = new Task({
        id,
        itemId,
        queueName,
        type,
        createdOn,
        status,
        dueOn,
        assignee
      });
    });

    it("should include the id", () => {
      expect(task.id)
        .to.equal(id);
    });

    it("should include the item id", () => {
      expect(task.itemId)
        .to.equal(itemId);
    });

    it("should include the queue name", () => {
      expect(task.queueName)
        .to.equal(queueName);
    });

    it("should include the type", () => {
      expect(task.type)
        .to.equal(type);
    });

    it("should include the created on date", () => {
      expect(task.createdOn)
        .to.equal(createdOn);
    });

    it("should include the status", () => {
      expect(task.status)
        .to.equal(status);
    });

    it("should include the due on date", () => {
      expect(task.dueOn)
        .to.equal(dueOn);
    });

    it("should include the assignee", () => {
      expect(task.assignee)
        .to.deep.equal(assignee);
    });

    describe("when the task is assigned", () => {
      const newAssignee = new TeamMember({ name: "Erica" });

      beforeEach(() => {
        task.unassign();
        task.assign(newAssignee);
      });

      it("should update the status", () => {
        expect(task.status)
          .to.equal(TaskStatus.Assigned);
      });

      it("should include the assignee", () => {
        expect(task.assignee)
          .to.deep.equal(newAssignee);
      });
    });

    describe("when the task is unassigned", () => {
      beforeEach(() => {
        task.unassign();
      });

      it("should update the status", () => {
        expect(task.status)
          .to.equal(TaskStatus.Unassigned);
      });

      it("should remove the assignee", () => {
        expect(task.assignee)
          .to.be.null;
      });
    });

    describe("when the task is completed", () => {
      beforeEach(() => {
        task.complete();
      });

      it("should update the status", () => {
        expect(task.status)
          .to.equal(TaskStatus.Completed);
      });

      it("should report the task is complete", () => {
        expect(task.isComplete)
          .to.equal(true);
      });
    });

    describe("when a modification is applied", () => {
      describe("when the task has a modification", () => {
        it("should call the modification passing the task", () => {
          const modification = {
            modify: (taskArg) => {
              expect(taskArg)
                .to.equal(task);
            }
          };
          task.applyModification(modification);
        });
      });

      describe("when the task does not have a modification", () => {
        it("should bypass application", () => {
          const modification = null;
          task.applyModification(modification);
          expect(true)
            .to.equal(true);
        });
      });
    });
  });
});
