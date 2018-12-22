import { expect } from "chai";
import { ConfiguredEventVersion } from "./configured-event-version";
import { ConfiguredEventVersionMap } from "./configured-event-version-map";

describe("configured event version suite", () => {
  describe("when a version is created", () => {
    let configuredEventVersion: ConfiguredEventVersion;
    const number = 1;
    const maps = [
      new ConfiguredEventVersionMap({
        source: "order.id",
        target: "foreignId"
      })
    ];

    beforeEach(() => {
      configuredEventVersion = new ConfiguredEventVersion({ number, maps });
    });

    it("should include the version number", () => {
      expect(configuredEventVersion.number).to.equal(number);
    });

    it("should include the maps", () => {
      expect(configuredEventVersion.maps).to.deep.equal(maps);
    });

    it("should be immutable", () => {
      expect(Object.isFrozen(configuredEventVersion)).to.equal(true);
    });
  });

  describe("when an attempt is made to create a version with invalid arguments", () => {
    it("should throw an error if the maps do not include a target for the foreign id", () => {
      const number = 1;
      const maps = [
        new ConfiguredEventVersionMap({
          source: "order.id",
          target: "xForeignId"
        })
      ];
      try {
        new ConfiguredEventVersion({ number, maps });
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
});
