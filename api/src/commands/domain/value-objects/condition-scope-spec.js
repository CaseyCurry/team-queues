import { expect } from "chai";
import { ConditionScope } from "./condition-scope";

describe("condition scope suite", () => {
  it("should allow the Any scope", () => {
    expect(ConditionScope.Any)
      .to.equal("Any");
  });

  it("should allow the All scope", () => {
    expect(ConditionScope.All)
      .to.equal("All");
  });

  it("should be immutable", () => {
    expect(Object.isFrozen(ConditionScope))
      .to.equal(true);
  });
});
