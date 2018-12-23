import { expect } from "chai";
import { ConditionGroup } from "./condition-group";
import { ConditionScope } from "./condition-scope";
import { Condition } from "./condition";

describe("condition group suite", () => {
  describe("when a group is created", () => {
    let conditionGroup;
    const scope = ConditionScope.All;
    const conditions = [
      new Condition({
        fact: "coffee",
        path: ".isHot",
        operator: "equal",
        value: true
      }),
      new ConditionGroup({
        scope: ConditionScope.Any,
        conditions: [
          new Condition({
            fact: "coffee",
            path: ".isFree",
            operator: "equal",
            value: false
          })
        ]
      })
    ];

    beforeEach(() => {
      conditionGroup = new ConditionGroup({ scope, conditions });
    });

    it("should include the scope", () => {
      expect(conditionGroup.scope).to.equal(scope);
    });

    it("should include a condition", () => {
      expect(conditionGroup.conditions[0]).to.deep.equal(conditions[0]);
    });

    it("should include a nested condition group", () => {
      expect(conditionGroup.conditions[1]).to.deep.equal(conditions[1]);
    });

    it("should be immutable", () => {
      expect(Object.isFrozen(conditionGroup)).to.equal(true);
    });
  });

  describe("when an attempt is made to create a fact with invalid arguments", () => {
    it("should throw an error if the scope is null", () => {
      const scope = null;
      const conditions = [
        new Condition({
          fact: "coffee",
          path: ".isHot",
          operator: "equal",
          value: true
        })
      ];
      try {
        new ConditionGroup({ scope, conditions });
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("should throw an error if the conditions are null", () => {
      const scope = ConditionScope.All;
      const conditions = null;
      try {
        new ConditionGroup({ scope, conditions });
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
});
