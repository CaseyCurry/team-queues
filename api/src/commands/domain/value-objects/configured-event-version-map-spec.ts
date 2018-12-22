import { expect } from "chai";
import { ConfiguredEventVersionMap } from "./configured-event-version-map";

describe("configured event version map suite", () => {
  describe("when a map is created", () => {
    let configuredEventVersionMap: ConfiguredEventVersionMap;
    const source = "order.id";
    const target = "foreignId";

    beforeEach(() => {
      configuredEventVersionMap = new ConfiguredEventVersionMap({
        source,
        target
      });
    });

    it("should include the source property", () => {
      expect(configuredEventVersionMap.source).to.equal(source);
    });

    it("should include the target property", () => {
      expect(configuredEventVersionMap.target).to.equal(target);
    });

    it("should be immutable", () => {
      expect(Object.isFrozen(configuredEventVersionMap)).to.equal(true);
    });
  });
});
