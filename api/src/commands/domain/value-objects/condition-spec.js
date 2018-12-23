import { expect } from "chai";
import { Condition } from "./condition";

describe("condition suite", () => {
  describe("when a condition is created", () => {
    let condition;
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

  describe("when an attempt is made to create a fact with invalid arguments", () => {
    it("should throw an error if the fact is null", () => {
      const fact = null;
      const path = ".isHot";
      const operator = "equal";
      const value = true;
      try {
        new Condition({
          fact,
          path,
          operator,
          value
        });
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("should throw an error if the path is null", () => {
      const fact = "coffee";
      const path = null;
      const operator = "equal";
      const value = true;
      try {
        new Condition({
          fact,
          path,
          operator,
          value
        });
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("should throw an error if the operator is null", () => {
      const fact = "coffee";
      const path = ".isHot";
      const operator = null;
      const value = true;
      try {
        new Condition({
          fact,
          path,
          operator,
          value
        });
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("should throw an error if the value is undefined", () => {
      const fact = "coffee";
      const path = ".isHot";
      const operator = "equal";
      const value = undefined;
      try {
        new Condition({
          fact,
          path,
          operator,
          value
        });
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
});
