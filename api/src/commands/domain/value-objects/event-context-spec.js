import { expect } from "chai";
import { EventContext } from "./event-context";
import { ConfiguredEventVersionMap } from "./configured-event-version-map";

describe("event context suite", () => {
  const name = "coffee-ordered";

  describe("when there is a simple property mapped", () => {
    it("should map the context", () => {
      const maps = [
        new ConfiguredEventVersionMap({
          source: "coffeeId",
          target: "foreignId"
        })
      ];
      const occurredEvent = {
        name,
        version: 1,
        coffeeId: 123
      };
      const context = new EventContext(occurredEvent, maps);
      expect(context.foreignId).to.equal(occurredEvent.coffeeId);
    });
  });

  describe("when there is a complex property in the source", () => {
    it("should map the context", () => {
      const maps = [
        new ConfiguredEventVersionMap({
          source: "coffee.id",
          target: "foreignId"
        })
      ];
      const occurredEvent = {
        name,
        version: 1,
        coffee: { id: 123 }
      };
      const context = new EventContext(occurredEvent, maps);
      expect(context.foreignId).to.equal(occurredEvent.coffee.id);
    });
  });

  describe("when there is a complex property in the target", () => {
    it("should map the context", () => {
      const maps = [
        new ConfiguredEventVersionMap({
          source: "coffee.id",
          target: "foreignId"
        }),
        new ConfiguredEventVersionMap({
          source: "coffee.isHot",
          target: "coffee.isHot"
        })
      ];
      const occurredEvent = {
        name,
        version: 1,
        coffee: {
          id: 123,
          isHot: true
        }
      };
      const context = new EventContext(occurredEvent, maps);
      expect(context).to.deep.equal({
        foreignId: occurredEvent.coffee.id,
        coffee: { isHot: occurredEvent.coffee.isHot }
      });
    });
  });

  describe("when there are nested properties in the source", () => {
    it("should map the context", () => {
      const maps = [
        new ConfiguredEventVersionMap({
          source: "coffee.nest.id",
          target: "foreignId"
        })
      ];
      const occurredEvent = {
        name,
        version: 1,
        coffee: {
          nest: {
            id: 123
          }
        }
      };
      const context = new EventContext(occurredEvent, maps);
      expect(context).to.deep.equal({
        foreignId: occurredEvent.coffee.nest.id
      });
    });
  });

  describe("when there are nested properties in the target", () => {
    it("should map the context", () => {
      const maps = [
        new ConfiguredEventVersionMap({
          source: "coffee.id",
          target: "foreignId"
        }),
        new ConfiguredEventVersionMap({
          source: "coffee.isHot",
          target: "coffee.nest.isHot"
        })
      ];
      const occurredEvent = {
        name,
        version: 1,
        coffee: {
          id: 123,
          isHot: true
        }
      };
      const context = new EventContext(occurredEvent, maps);
      expect(context).to.deep.equal({
        foreignId: occurredEvent.coffee.id,
        coffee: {
          nest: {
            isHot: occurredEvent.coffee.isHot
          }
        }
      });
    });
  });

  describe("when there are multiple nested properties in the target mapped", () => {
    it("should map the context", () => {
      const maps = [
        new ConfiguredEventVersionMap({
          source: "coffee.isHot",
          target: "coffee.nest.isHot"
        }),
        new ConfiguredEventVersionMap({
          source: "coffee.isFree",
          target: "coffee.nest.isFree"
        }),
        new ConfiguredEventVersionMap({
          source: "coffee.id",
          target: "foreignId"
        })
      ];
      const occurredEvent = {
        name,
        version: 1,
        coffee: {
          id: 123,
          isHot: true,
          isFree: false
        }
      };
      const context = new EventContext(occurredEvent, maps);
      expect(context).to.deep.equal({
        coffee: {
          nest: {
            isHot: occurredEvent.coffee.isHot,
            isFree: occurredEvent.coffee.isFree
          }
        },
        foreignId: occurredEvent.coffee.id
      });
    });
  });

  describe("when there is an array in the source", () => {
    it("should map the context", () => {
      const maps = [
        new ConfiguredEventVersionMap({
          source: "coffee.id",
          target: "foreignId"
        }),
        new ConfiguredEventVersionMap({
          source: "coffee.additions",
          target: "additions"
        })
      ];
      const occurredEvent = {
        name,
        version: 1,
        coffee: {
          id: 123,
          additions: ["milk", "sugar"]
        }
      };
      const context = new EventContext(occurredEvent, maps);
      expect(context).to.deep.equal({
        foreignId: occurredEvent.coffee.id,
        additions: occurredEvent.coffee.additions
      });
    });
  });

  describe("when there is a property mapped that is missing in the source", () => {
    it("should set the missing property value to null", () => {
      const maps = [
        new ConfiguredEventVersionMap({
          source: "coffee.id",
          target: "foreignId"
        }),
        new ConfiguredEventVersionMap({
          source: "coffee.additions",
          target: "additions"
        })
      ];
      const occurredEvent = {
        name,
        version: 1,
        coffee: {
          id: 123
        }
      };
      const context = new EventContext(occurredEvent, maps);
      expect(context.additions).to.be.null;
    });
  });
});
