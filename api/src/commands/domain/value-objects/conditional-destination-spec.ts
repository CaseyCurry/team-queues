import { expect } from "chai";
import { ConditionalDestination } from "./conditional-destination";
import { ConditionGroup } from "./condition-group";
import { ConditionScope } from "./condition-scope";
import { Condition } from "./condition";
import { UnconditionalDestination } from "./unconditional-destination";

describe("conditional destination suite", () => {
  describe("when a destination is created", () => {
    let conditionalDestination: ConditionalDestination;
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
        taskType: "Make Hot Cofee",
        modification: undefined,
        doesCompletePreviousTask: false
      })
    ];
    const onFalse = [
      new UnconditionalDestination({
        queueName: "Barista Queue",
        taskType: "Make Cold Cofee",
        modification: undefined,
        doesCompletePreviousTask: false
      })
    ];

    beforeEach(() => {
      conditionalDestination = new ConditionalDestination({
        group,
        onTrue,
        onFalse
      });
    });

    it("should include the group", () => {
      expect(conditionalDestination.group).to.deep.equal(group);
    });

    it("should include the destination for when the condition is true", () => {
      expect(conditionalDestination.onTrue).to.deep.equal(onTrue);
    });

    it("should include the destination for when the condition is false", () => {
      expect(conditionalDestination.onFalse).to.deep.equal(onFalse);
    });

    it("should be immutable", () => {
      expect(Object.isFrozen(conditionalDestination)).to.equal(true);
    });
  });
});
