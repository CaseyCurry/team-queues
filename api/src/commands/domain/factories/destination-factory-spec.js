import { expect } from "chai";
import { DestinationFactory } from "./destination-factory";
import { Modification } from "../value-objects/modification";
import { UnconditionalDestination } from "../value-objects/unconditional-destination";
import { ConditionalDestination } from "../value-objects/conditional-destination";
import { ConditionGroup } from "../value-objects/condition-group";
import { ConditionScope } from "../value-objects/condition-scope";
import { Condition } from "../value-objects/condition";
import { TriggeredCompletion } from "../value-objects/triggered-completion";
import { TriggeredDestination } from "../value-objects/triggered-destination";

describe("destination factory suite", () => {
  describe("when a queue name is passed as an argument", () => {
    const queueName = "Cashier Queue";
    const taskType = "Take Order";
    const modification = new Modification({
      text: "dueOn + @minute(1)"
    });
    const doesCompletePreviousTask = true;
    let destination;

    beforeEach(() => {
      destination = DestinationFactory.create({
        queueName,
        taskType,
        modification,
        doesCompletePreviousTask
      });
    });

    it("should create an unconditional destination", () => {
      expect(destination instanceof UnconditionalDestination).to.equal(true);
    });

    it("should create an unconditional destination with the queue name", () => {
      expect(destination.queueName).to.equal(queueName);
    });

    it("should create an unconditional destination with the task type", () => {
      expect(destination.taskType).to.equal(taskType);
    });

    it("should create an unconditional destination with the modification", () => {
      expect(destination.modification).to.deep.equal(modification);
    });

    it("should create an unconditional destination with the flag that indicates the previous task should be completed", () => {
      expect(destination.doesCompletePreviousTask).to.equal(
        doesCompletePreviousTask
      );
    });
  });

  describe("when a group is passed as an argument", () => {
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
    let destination;

    beforeEach(() => {
      destination = DestinationFactory.create({
        group,
        onTrue,
        onFalse
      });
    });

    it("should create a conditional destination", () => {
      expect(destination instanceof ConditionalDestination).to.equal(true);
    });

    it("should create a conditional destination with the group", () => {
      expect(destination.group).to.deep.equal(group);
    });

    it("should create a conditional destination with the destination for when the condition is true", () => {
      expect(destination.onTrue).to.deep.equal(onTrue);
    });

    it("should create a conditional destination with the destination for when the condition is false", () => {
      expect(destination.onFalse).to.deep.equal(onFalse);
    });
  });

  describe("when a flag is passed that indicates the destination completes the item as an argument", () => {
    const eventNames = ["delivery.delivery-coffee"];
    const doesCompletePreviousTask = true;
    const doesCompleteItem = true;
    let destination;

    beforeEach(() => {
      destination = DestinationFactory.create({
        eventNames,
        doesCompletePreviousTask,
        doesCompleteItem
      });
    });

    it("should create a triggered completion", () => {
      expect(destination instanceof TriggeredCompletion).to.equal(true);
    });

    it("should create a triggered completion with the event names", () => {
      expect(destination.eventNames).to.equal(eventNames);
    });

    it("should create a triggered completion with a flag that indicates the previous task should be completed", () => {
      expect(destination.doesCompletePreviousTask).to.equal(
        doesCompletePreviousTask
      );
    });

    it("should create a triggered completion with a flag that indicates the item should be completed", () => {
      expect(destination.doesCompleteItem).to.equal(doesCompleteItem);
    });
  });

  describe("when neither the queue name, the group, nor a flag that indicates the destination completes the item is passed as an argument", () => {
    const eventNames = ["delivery.delivery-coffee"];
    const destinations = [
      new UnconditionalDestination({
        queueName: "Barista Queue",
        taskType: "Make Coffee"
      })
    ];
    let destination;

    beforeEach(() => {
      destination = DestinationFactory.create({
        eventNames,
        destinations
      });
    });

    it("should create a triggered destination", () => {
      expect(destination instanceof TriggeredDestination).to.equal(true);
    });

    it("should create a triggered destination with the event names", () => {
      expect(destination.eventNames).to.equal(eventNames);
    });

    it("should create a triggered destination with destinations", () => {
      expect(destination.destinations).to.deep.equal(destinations);
    });
  });
});
