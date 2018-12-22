import { expect } from "chai";
import { Condition } from "./condition";

describe("condition suite", () => {
  describe("when a condition is created", () => {
    let condition: Condition;
    const fact = "coffee";
    const path = ".isHot";
    const operator = "equal";
    const value = true;

    beforeEach(() => {
      condition = new Condition({
        fact,
        path,
        operator,
        value
      });
    });

    it("should include the fact", () => {
      expect(condition.fact).to.equal(fact);
    });

    it("should include the path", () => {
      expect(condition.path).to.equal(path);
    });

    it("should include the operator", () => {
      expect(condition.operator).to.equal(operator);
    });

    it("should include the value", () => {
      expect(condition.value).to.equal(value);
    });

    it("should be immutable", () => {
      expect(Object.isFrozen(condition)).to.equal(true);
    });
  });
});
