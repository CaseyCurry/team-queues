import { expect } from "chai";
import { DestinationProcessor } from "./destination-processor";
import { UnconditionalDestination } from "../value-objects/unconditional-destination";
import { ConditionalDestination } from "../value-objects/conditional-destination";
import { ConditionGroup } from "../value-objects/condition-group";
import { ConditionScope } from "../value-objects/condition-scope";
import { Condition } from "../value-objects/condition";
import { ConditionFact } from "../value-objects/condition-fact";
import { Task } from "../entities/task";
import { TaskStatus } from "../value-objects/task-status";

describe("destination processor suite", () => {
  let processor;
  const incompleteTask = new Task({
    id: 123,
    itemId: 456,
    queueName: "Cashier Queue",
    type: "Take Order",
    createdOn: new Date(),
    status: TaskStatus.Unassigned,
    dueOn: new Date()
  });
  const eventContext = {};

  describe("when the destination is unconditional", () => {
    const destination = new UnconditionalDestination({
      queueName: "Barista Queue",
      taskType: "Make Coffee"
    });

    beforeEach(() => {
      const rulesEngine = {};
      processor = DestinationProcessor(rulesEngine);
    });

    it("should create a task using the destination", (done) => {
      const item = {
        createTask: (destinationArg) => {
          expect(destinationArg)
            .to.equal(destination);
          done();
        }
      };
      processor.process(destination, item, eventContext, incompleteTask);
    });

    it("should create a task using the incomplete task", (done) => {
      const item = {
        createTask: (destinationArg, incompleteTaskArg) => {
          expect(incompleteTaskArg)
            .to.equal(incompleteTask);
          done();
        }
      };
      processor.process(destination, item, eventContext, incompleteTask);
    });
  });

  describe("when the destination is conditional", () => {
    const group = new ConditionGroup({
      scope: ConditionScope.All,
      conditions: [
        new Condition({
          fact: "coffee",
          path: ".isHot",
          operator: "equal",
          value: true
        })
      ]
    });
    const onTrue = [
      new UnconditionalDestination({
        queueName: "Barista Queue",
        taskType: "Make Hot Cofee"
      })
    ];
    const onFalse = [
      new UnconditionalDestination({
        queueName: "Barista Queue",
        taskType: "Make Cold Cofee"
      })
    ];
    const destination = new ConditionalDestination({ group, onTrue, onFalse });

    it("should call the rules engine passing the destination", (done) => {
      const item = {
        createTask: () => {}
      };
      const rulesEngine = {
        getNextDestinations: (destinationArg) => {
          return new Promise((resolve) => {
            expect(destinationArg)
              .to.equal(destination);
            done();
            resolve([]);
          });
        }
      };
      processor = DestinationProcessor(rulesEngine);
      processor.process(destination, item, eventContext, incompleteTask);
    });

    it("should call the rules engine passing the fact", (done) => {
      const item = {
        createTask: () => {}
      };
      const rulesEngine = {
        getNextDestinations: (destinationArg, factArg) => {
          return new Promise((resolve) => {
            expect(factArg)
              .to.deep.equal(new ConditionFact(eventContext, incompleteTask));
            done();
            resolve([]);
          });
        }
      };
      processor = DestinationProcessor(rulesEngine);
      processor.process(destination, item, eventContext, incompleteTask);
    });

    it("should create a task in the destinations returned by the rules engine", (done) => {
      const rulesEngine = {
        getNextDestinations: () => {
          return new Promise((resolve) => {
            resolve(onTrue);
          });
        }
      };
      const item = {
        createTask: (destinationArg) => {
          expect(destinationArg)
            .to.equal(onTrue[0]);
          done();
        }
      };
      processor = DestinationProcessor(rulesEngine);
      processor.process(destination, item, eventContext, incompleteTask);
    });
  });

  it("should call the processor asynchronously", async () => {
    const destination = new UnconditionalDestination({
      queueName: "Barista Queue",
      taskType: "Make Coffee"
    });
    const item = {
      createTask: () => {}
    };
    const rulesEngine = {};
    processor = DestinationProcessor(rulesEngine);
    await processor.process(destination, item, eventContext, incompleteTask);
    expect(true)
      .to.equal(true);
  });
});
