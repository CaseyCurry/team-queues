import { expect } from "chai";
import { ConditionalDestination } from "./conditional-destination";
import { ConditionGroup } from "./condition-group";
import { ConditionScope } from "./condition-scope";
import { Condition } from "./condition";
import { UnconditionalDestination } from "./unconditional-destination";

describe("conditional destination suite", () => {
  describe("when a destination is created", () => {
    let conditionalDestination;
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

    beforeEach(() => {
      conditionalDestination = new ConditionalDestination({
        group,
        onTrue,
        onFalse
      });
    });

    it("should include the group", () => {
      expect(conditionalDestination.group)
        .to.deep.equal(group);
    });

    it("should include the destination for when the condition is true", () => {
      expect(conditionalDestination.onTrue)
        .to.deep.equal(onTrue);
    });

    it("should include the destination for when the condition is false", () => {
      expect(conditionalDestination.onFalse)
        .to.deep.equal(onFalse);
    });

    it("should be immutable", () => {
      expect(Object.isFrozen(conditionalDestination))
        .to.equal(true);
    });
  });

  describe("when an attempt is made to create a fact with invalid arguments", () => {
    it("should throw an error if the group is null", () => {
      const group = null;
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
      try {
        new ConditionalDestination({
          group,
          onTrue,
          onFalse
        });
      } catch (error) {
        expect(error)
          .to.exist;
      }
    });

    it("should throw an error if the destination for when the condition is true is null", () => {
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
      const onTrue = null;
      const onFalse = [
        new UnconditionalDestination({
          queueName: "Barista Queue",
          taskType: "Make Cold Cofee"
        })
      ];
      try {
        new ConditionalDestination({
          group,
          onTrue,
          onFalse
        });
      } catch (error) {
        expect(error)
          .to.exist;
      }
    });

    it("should throw an error if the destination for when the condition is false is null", () => {
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
      const onFalse = null;
      try {
        new ConditionalDestination({
          group,
          onTrue,
          onFalse
        });
      } catch (error) {
        expect(error)
          .to.exist;
      }
    });
  });
});
