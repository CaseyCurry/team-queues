import { expect } from "chai";
import { RulesEngine } from "./rules-engine";
import { ConditionalDestination } from "../../domain/value-objects/conditional-destination";
import { ConditionGroup } from "../../domain/value-objects/condition-group";
import { UnconditionalDestination } from "../../domain/value-objects/unconditional-destination";

describe("rules engine suite", () => {
  let engine;
  let destination;
  const targetQueueName1 = "Cashier Queue";
  const targetTaskType1 = "Take Order";
  const targetQueueName2 = "Barista Queue";
  const targetTaskType2 = "Make Coffee";
  const targetQueueName3 = "Barista Queue";
  const targetTaskType3 = "Make Hot Coffee";

  beforeEach(() => {
    engine = RulesEngine();
    destination = new ConditionalDestination({
      group: new ConditionGroup({
        scope: "All",
        conditions: [
          {
            fact: "@event",
            path: ".coffee.isHot",
            operator: "equal",
            value: true
          }
        ]
      }),
      onTrue: [
        new UnconditionalDestination({
          queueName: targetQueueName1,
          taskType: targetTaskType1
        })
      ],
      onFalse: [
        new ConditionalDestination({
          group: new ConditionGroup({
            scope: "All",
            conditions: [
              {
                fact: "@event",
                path: ".coffee.isFree",
                operator: "equal",
                value: true
              }
            ]
          }),
          onTrue: [
            new UnconditionalDestination({
              queueName: targetQueueName2,
              taskType: targetTaskType2
            })
          ],
          onFalse: [
            new UnconditionalDestination({
              queueName: targetQueueName3,
              taskType: targetTaskType3
            })
          ]
        })
      ]
    });
  });

  describe("when conditions are met engine", () => {
    const eventContext = {
      coffee: {
        isHot: true
      }
    };
    let nextDestinations;

    beforeEach(async () => {
      nextDestinations = await engine.getNextDestinations(
        destination,
        eventContext
      );
    });

    it("should report true and add a task with the queue name", () => {
      expect(nextDestinations[0].queueName).to.equal(targetQueueName1);
    });

    it("should report true and add a task of the type", () => {
      expect(nextDestinations[0].taskType).to.equal(targetTaskType1);
    });
  });

  describe("when nested conditions are met engine", () => {
    const eventContext = {
      coffee: {
        isHot: false,
        isFree: true
      }
    };
    let nextDestinations;

    beforeEach(async () => {
      nextDestinations = await engine.getNextDestinations(
        destination,
        eventContext
      );
    });

    it("should report true and add a task with the queue name", () => {
      expect(nextDestinations[0].queueName).to.equal(targetQueueName2);
    });

    it("should report true and add a task of the type", () => {
      expect(nextDestinations[0].taskType).to.equal(targetTaskType2);
    });
  });

  describe("when conditions are not met engine", () => {
    const eventContext = {
      coffee: {
        isHot: false,
        isFree: false
      }
    };
    let nextDestinations;

    beforeEach(async () => {
      nextDestinations = await engine.getNextDestinations(
        destination,
        eventContext
      );
    });

    it("should report true and add a task with the queue name", () => {
      expect(nextDestinations[0].queueName).to.equal(targetQueueName3);
    });

    it("should report true and add a task of the type", () => {
      expect(nextDestinations[0].taskType).to.equal(targetTaskType3);
    });
  });
});
