import { expect } from "chai";
import { Item } from "./item";
import { Task } from "../entities/task";
import { TaskStatus } from "../value-objects/task-status";
import { UnconditionalDestination } from "../value-objects/unconditional-destination";
import { Modification } from "../value-objects/modification";

describe("item suite", () => {
  const id = 123;
  const foreignId = 456;
  const lifecycleId = 789;

  describe("when item is created", () => {
    let item;
    const tasks = [];

    beforeEach(() => {
      item = new Item({ id, foreignId, tasks, lifecycleId });
    });

    it("should create an item with the id", () => {
      expect(item.id)
        .to.equal(id);
    });

    it("should create an item with the foreign id", () => {
      expect(item.foreignId)
        .to.equal(foreignId);
    });

    it("should create an item with the tasks", () => {
      expect(item.tasks)
        .to.deep.equal(tasks);
    });

    it("should create an item with the lifecycle id", () => {
      expect(item.lifecycleId)
        .to.equal(lifecycleId);
    });
  });

  describe("when an id is not passed", () => {
    it("should create an item with the id", () => {
      const item = new Item({});
      expect(item.id)
        .to.exist;
    });
  });

  describe("when tasks are not passed", () => {
    it("should create an item with an empty array of tasks", () => {
      const item = new Item({});
      expect(item.tasks.length)
        .to.equal(0);
    });
  });

  describe("when a task is created", () => {
    describe("when there is no current task", () => {
      let item;
      let destination;

      beforeEach(async () => {
        item = new Item({ id: 123 });
        destination = new UnconditionalDestination({
          queueName: "Barista Queue",
          taskType: "Make Coffee",
          doesCompletePreviousTask: true
        });
        await item.createTask(destination);
      });

      it("should add a task", () => {
        expect(item.tasks.length)
          .to.equal(1);
      });

      it("should add a task with the item id", () => {
        expect(item.tasks[0].itemId)
          .to.equal(item.id);
      });

      it("should add a task with the destination's queue name", () => {
        expect(item.tasks[0].queueName)
          .to.equal(destination.queueName);
      });

      it("should add a task of the destination's type", () => {
        expect(item.tasks[0].type)
          .to.equal(destination.taskType);
      });

      it("should add a task with the created date", () => {
        expect(item.tasks[0].createdOn)
          .to.exist;
      });

      it("should add an unassigned task", () => {
        expect(item.tasks[0].status)
          .to.equal(TaskStatus.Unassigned);
      });

      it("should add a task with the due date", () => {
        expect(item.tasks[0].dueOn)
          .to.exist;
      });

      it("should raise a single event", () => {
        expect(item.domainEvents.raisedEvents.length)
          .to.equal(1);
      });

      it("should raise a task created event", () => {
        expect(item.domainEvents.raisedEvents[0].name)
          .to.equal("team-queues.task-created");
      });
    });

    describe("when there is a current task that is complete", () => {
      let item;
      let destination;

      beforeEach(async () => {
        item = new Item({ id: 123 });
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
        expect(item.domainEvents.raisedEvents.length)
          .to.equal(1);
      });
    });

    describe("when there is a current task that is incomplete", () => {
      let item;
      let destination;
      let currentTask;

      describe("when the destination completes the current task", () => {
        beforeEach(async () => {
          item = new Item({ id: 123 });
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
          expect(currentTask.isComplete)
            .to.equal(true);
        });

        it("should raise an event for the completion of the current task", () => {
          expect(item.domainEvents.raisedEvents[1].name)
            .to.equal("team-queues.task-completed");
        });
      });

      describe("when the destination does not complete the current task", () => {
        let currentTask;

        beforeEach(async () => {
          item = new Item({ id: 123 });
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
          expect(currentTask.isComplete)
            .to.equal(false);
        });

        it("should not raise an event for the completion of the current task", () => {
          expect(item.domainEvents.raisedEvents.length)
            .to.equal(1);
        });
      });
    });

    describe("when a destination has a task modification that adds 5 minutes to the task due date", () => {
      let item;
      let destination;

      beforeEach(async () => {
        item = new Item({ id: 123 });
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
        expect(item.tasks[0].dueOn)
          .to.be.within(
            new Date(now.getTime() + (minutesToAdd * 60 * 1000) - 1000),
            new Date(now.getTime() + (minutesToAdd * 60 * 1000) + 1000));
      });
    });
  });
});
