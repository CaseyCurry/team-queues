import { expect } from "chai";
import { ConfiguredEventVersionMap } from "./configured-event-version-map";

describe("configured event version map suite", () => {
  describe("when a map is created", () => {
    let configuredEventVersionMap;
    const source = "order.id";
    const target = "foreignId";

    beforeEach(() => {
      configuredEventVersionMap = new ConfiguredEventVersionMap({ source, target });
    });

    it("should include the source property", () => {
      expect(configuredEventVersionMap.source)
        .to.equal(source);
    });

    it("should include the target property", () => {
      expect(configuredEventVersionMap.target)
        .to.equal(target);
    });

    it("should be immutable", () => {
      expect(Object.isFrozen(configuredEventVersionMap))
        .to.equal(true);
    });
  });

  describe("when an attempt is made to create a map with invalid arguments", () => {
    it("should throw an error if the source is null", () => {
      const source = null;
      const target = "foreignId";
      try {
        new ConfiguredEventVersionMap({ source, target });
      } catch (error) {
        expect(error)
          .to.exist;
      }
    });

    it("should throw an error if the current task is null", () => {
      const source = "order.id";
      const target = null;
      try {
        new ConfiguredEventVersionMap({ source, target });
      } catch (error) {
        expect(error)
          .to.exist;
      }
    });
  });
});
