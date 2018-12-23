import { expect } from "chai";
import { Item } from "./item";
import { Task } from "../entities/task";
import { TaskStatus } from "../value-objects/task-status";
import { UnconditionalDestination } from "../value-objects/unconditional-destination";
import { Modification } from "../value-objects/modification";
import { TeamMember } from "../value-objects/team-member";
import { TaskAssignedEvent } from "../events/task-assigned-event";
import { TaskUnassignedEvent } from "../events/task-unassigned-event";
import { TaskCompletedEvent } from "../events/task-completed-event";
import { ItemCompletedEvent } from "../events/item-completed-event";

describe("item suite", () => {
  const id = 123;
  const foreignId = 456;
  const lifecycleId = 789;

  describe("when item is created", () => {
    let item;
    const tasks = [
      new Task({
        id: 1,
        queueName: "Barista Queue",
        type: "Make Coffee",
        createdOn: new Date(),
        status: TaskStatus.Unassigned,
        dueOn: new Date()
      })
    ];

    beforeEach(() => {
      item = new Item({ id, foreignId, tasks, lifecycleId });
    });

    it("should create an item with the id", () => {
      expect(item.id).to.equal(id);
    });

    it("should create an item with the foreign id", () => {
      expect(item.foreignId).to.equal(foreignId);
    });

    it("should create an item with the tasks", () => {
      expect(item.tasks).to.deep.equal(tasks);
    });

    it("should create an item with the lifecycle id", () => {
      expect(item.lifecycleId).to.equal(lifecycleId);
    });

    describe("when a task is created", () => {
      describe("when there is no current task", () => {
        let destination;

        beforeEach(async () => {
          destination = new UnconditionalDestination({
            queueName: "Barista Queue",
            taskType: "Make Coffee",
            doesCompletePreviousTask: true
          });
          await item.createTask(destination);
        });

        it("should add a task", () => {
          expect(item.tasks.length).to.equal(2);
        });

        it("should add a task with an id of 2 which is one greater than the existing task in the item", () => {
          expect(item.tasks[1].id).to.equal(2);
        });

        it("should add a task with the destination's queue name", () => {
          expect(item.tasks[1].queueName).to.equal(destination.queueName);
        });

        it("should add a task of the destination's type", () => {
          expect(item.tasks[1].type).to.equal(destination.taskType);
        });

        it("should add a task with the created date", () => {
          expect(item.tasks[1].createdOn).to.exist;
        });

        it("should add an unassigned task", () => {
          expect(item.tasks[1].status).to.equal(TaskStatus.Unassigned);
        });

        it("should add a task with the due date", () => {
          expect(item.tasks[1].dueOn).to.exist;
        });

        it("should raise a single event", () => {
          expect(item.domainEvents.raisedEvents.length).to.equal(1);
        });

        it("should raise a task created event", () => {
          expect(item.domainEvents.raisedEvents[0].name).to.equal(
            "team-queues.task-created"
          );
        });

        it("should include the task when getting incomplete tasks", async () => {
          const incompleteTasks = item.incompleteTasks;
          expect(incompleteTasks.find(task => task.id === 2)).to.exist;
        });
      });

      describe("when there is a current task that is complete", () => {
        let destination;

        beforeEach(async () => {
          destination = new UnconditionalDestination({
            queueName: "Barista Queue",
            taskType: "Make Coffee",
            doesCompletePreviousTask: true
          });
          const currentTask = new Task({
            status: TaskStatus.Completed
          });
          await item.createTask(destination, currentTask);
        });

        it("should raise a single event", () => {
          expect(item.domainEvents.raisedEvents.length).to.equal(1);
        });
      });

      describe("when there is a current task that is incomplete", () => {
        let destination;
        let currentTask;

        describe("when the destination completes the current task", () => {
          beforeEach(async () => {
            destination = new UnconditionalDestination({
              queueName: "Barista Queue",
              taskType: "Make Coffee",
              doesCompletePreviousTask: true
            });
            currentTask = new Task({
              status: TaskStatus.Unassigned
            });
            await item.createTask(destination, currentTask);
          });

          it("should complete the current task", () => {
            expect(currentTask.isComplete).to.equal(true);
          });

          it("should raise an event for the completion of the current task", () => {
            expect(item.domainEvents.raisedEvents[1].name).to.equal(
              "team-queues.task-completed"
            );
          });
        });

        describe("when the destination does not complete the current task", () => {
          let currentTask;

          beforeEach(async () => {
            destination = new UnconditionalDestination({
              queueName: "Barista Queue",
              taskType: "Make Coffee",
              doesCompletePreviousTask: false
            });
            currentTask = new Task({
              status: TaskStatus.Unassigned
            });
            await item.createTask(destination, currentTask);
          });

          it("should not complete the current task", () => {
            expect(currentTask.isComplete).to.equal(false);
          });

          it("should not raise an event for the completion of the current task", () => {
            expect(item.domainEvents.raisedEvents.length).to.equal(1);
          });
        });
      });

      describe("when a destination has a task modification that adds 5 minutes to the task due date", () => {
        let destination;

        beforeEach(async () => {
          destination = new UnconditionalDestination({
            queueName: "Barista Queue",
            taskType: "Make Free Coffee",
            modification: new Modification({ text: "dueOn + @minute(5)" }),
            doesCompletePreviousTask: true
          });
          const currentTask = new Task({
            status: TaskStatus.Completed
          });
          await item.createTask(destination, currentTask);
        });

        it("should modify the task", () => {
          const now = new Date();
          const minutesToAdd = 5;
          expect(item.tasks[1].dueOn).to.be.within(
            new Date(now.getTime() + minutesToAdd * 60 * 1000 - 1000),
            new Date(now.getTime() + minutesToAdd * 60 * 1000 + 1000)
          );
        });
      });
    });

    describe("when a task is assigned", () => {
      let task;
      let assignee;

      beforeEach(async () => {
        task = item.tasks[0];
        assignee = new TeamMember({ name: "Jane" });
        await item.assignTask(task, assignee);
      });

      it("should set the assignee", async () => {
        expect(task.assignee).to.equal(assignee);
      });

      it("should raise an event", async () => {
        expect(
          item.domainEvents.raisedEvents[
            item.domainEvents.raisedEvents.length - 1
          ] instanceof TaskAssignedEvent
        ).to.be.true;
      });
    });

    describe("when a task is unassigned", () => {
      let task;

      beforeEach(async () => {
        task = item.tasks[0];
        const assignee = new TeamMember({ name: "Jane" });
        await item.assignTask(task, assignee);
        await item.unassignTask(task);
      });

      it("should clear the assignee", async () => {
        expect(task.assignee).to.not.exist;
      });

      it("should raise an event", async () => {
        expect(
          item.domainEvents.raisedEvents[
            item.domainEvents.raisedEvents.length - 1
          ] instanceof TaskUnassignedEvent
        ).to.be.true;
      });
    });

    describe("when a task is completed", () => {
      let task;

      beforeEach(async () => {
        task = item.tasks[0];
        await item.completeTask(task);
      });

      it("should set the task to complete", async () => {
        expect(task.status).to.equal(TaskStatus.Completed);
      });

      it("should raise an event", async () => {
        expect(
          item.domainEvents.raisedEvents[
            item.domainEvents.raisedEvents.length - 1
          ] instanceof TaskCompletedEvent
        ).to.be.true;
      });
    });

    describe("when the item is completed", () => {
      beforeEach(async () => {
        await item.completeItem();
      });

      it("should set the item to complete", async () => {
        expect(item.isComplete).to.be.true;
      });

      it("should complete all it's tasks", async () => {
        const task = item.tasks[0];
        expect(task.status).to.equal(TaskStatus.Completed);
      });

      it("should raise an event", async () => {
        expect(
          item.domainEvents.raisedEvents[
            item.domainEvents.raisedEvents.length - 1
          ] instanceof ItemCompletedEvent
        ).to.be.true;
      });
    });
  });

  describe("when tasks are not passed", () => {
    let item;

    beforeEach(() => {
      item = new Item({});
    });

    it("should create an item with an empty array of tasks", () => {
      expect(item.tasks.length).to.equal(0);
    });

    describe("when a task is created", () => {
      it("should add a task with id of 1", async () => {
        const destination = new UnconditionalDestination({
          queueName: "Barista Queue",
          taskType: "Make Coffee",
          doesCompletePreviousTask: false
        });
        await item.createTask(destination);
        expect(item.tasks[0].id).to.equal(1);
      });
    });
  });
});
