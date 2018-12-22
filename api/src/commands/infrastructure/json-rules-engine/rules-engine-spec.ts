import { expect } from "chai";
import { RulesEngine } from "./rules-engine";
import { ConditionalDestination } from "../../domain/value-objects/conditional-destination";
import { ConditionGroup } from "../../domain/value-objects/condition-group";
import { UnconditionalDestination } from "../../domain/value-objects/unconditional-destination";
import { Task } from "../../domain/entities/task";
import { UntriggerableDestinationInterface } from "../../domain/value-objects/untriggerable-destination-interface";
import { ConditionScope } from "../../domain/value-objects/condition-scope";

describe("rules engine suite", () => {
  let engine: RulesEngine;
  let destination: UntriggerableDestinationInterface;
  const targetQueueName1 = "Cashier Queue";
  const targetTaskType1 = "Take Order";
  const targetQueueName2 = "Barista Queue";
  const targetTaskType2 = "Make Coffee";
  const targetQueueName3 = "Barista Queue";
  const targetTaskType3 = "Make Hot Coffee";

  beforeEach(() => {
    engine = new RulesEngine();
    destination = new ConditionalDestination({
      group: new ConditionGroup({
        scope: ConditionScope.All,
        conditions: [
          {
            fact: "@event",
            path: ".isHot",
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
            scope: ConditionScope.All,
            conditions: [
              {
                fact: "@event",
                path: ".isFree",
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
    const currentTask: Task = null;
    let nextDestinations: UntriggerableDestinationInterface[];

    beforeEach(async () => {
      nextDestinations = await engine.getNextDestinations(
        destination,
        eventContext,
        currentTask
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
    const currentTask: Task = null;
    let nextDestinations: UntriggerableDestinationInterface[];

    beforeEach(async () => {
      nextDestinations = await engine.getNextDestinations(
        destination,
        eventContext,
        currentTask
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
    const currentTask: Task = null;
    let nextDestinations: UntriggerableDestinationInterface[];

    beforeEach(async () => {
      nextDestinations = await engine.getNextDestinations(
        destination,
        eventContext,
        currentTask
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
