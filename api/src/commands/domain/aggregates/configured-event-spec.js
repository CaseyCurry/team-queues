import { expect } from "chai";
import { ConfiguredEvent } from "./configured-event";
import { ConfiguredEventVersionMap } from "../value-objects/configured-event-version-map";

describe("configured event suite", () => {
  const name = "coffee-ordered";
  const isActive = true;
  let configuredEvent;

  beforeEach(() => {
    configuredEvent = new ConfiguredEvent({ name, isActive });
  });

  describe("when configured event is created", () => {
    let event;
    const versions = [];

    beforeEach(() => {
      event = new ConfiguredEvent({ name, isActive, versions });
    });

    it("should create an event with the name", () => {
      expect(event.name)
        .to.equal(name);
    });

    it("should create an event with the active flag", () => {
      expect(event.isActive)
        .to.equal(isActive);
    });

    it("should create an event with the versions", () => {
      expect(event.versions)
        .to.deep.equal(versions);
    });
  });

  describe("when getting the context from the event", () => {
    describe("when there is a simple property mapped", () => {
      let context;
      let occurredEvent;

      beforeEach(() => {
        const maps = [
          new ConfiguredEventVersionMap({
            source: "coffeeId",
            target: "foreignId"
          })
        ];
        configuredEvent.configureVersion({
          number: 1,
          maps: maps
        });
        occurredEvent = {
          name,
          version: 1,
          coffeeId: 123
        };
        context = configuredEvent.getContext(occurredEvent);
      });

      it("should map the context", () => {
        expect(context.foreignId)
          .to.equal(occurredEvent.coffeeId);
      });

      describe("when there is an exact version match", () => {
        it("should map the context", () => {
          expect(context.foreignId)
            .to.equal(occurredEvent.coffeeId);
        });
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
        configuredEvent.configureVersion({
          number: 1,
          maps: maps
        });
        const occurredEvent = {
          name,
          version: 1,
          coffee: { id: 123 }
        };
        const context = configuredEvent.getContext(occurredEvent);
        expect(context.foreignId)
          .to.equal(occurredEvent.coffee.id);
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
        configuredEvent.configureVersion({
          number: 1,
          maps: maps
        });
        const occurredEvent = {
          name,
          version: 1,
          coffee: {
            id: 123,
            isHot: true
          }
        };
        const context = configuredEvent.getContext(occurredEvent);
        expect(context)
          .to.deep.equal({
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
        configuredEvent.configureVersion({
          number: 1,
          maps: maps
        });
        const occurredEvent = {
          name,
          version: 1,
          coffee: {
            nest: {
              id: 123,
              isHot: true,
              additions: ["milk", "sugar"]
            }
          }
        };
        const context = configuredEvent.getContext(occurredEvent);
        expect(context)
          .to.deep.equal({
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
        configuredEvent.configureVersion({
          number: 1,
          maps: maps
        });
        const occurredEvent = {
          name,
          version: 1,
          coffee: {
            id: 123,
            isHot: true,
            additions: ["milk", "sugar"]
          }
        };
        const context = configuredEvent.getContext(occurredEvent);
        expect(context)
          .to.deep.equal({
            foreignId: occurredEvent.coffee.id,
            coffee: {
              nest: {
                isHot: occurredEvent.coffee.isHot
              }
            }
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
        configuredEvent.configureVersion({
          number: 1,
          maps: maps
        });
        const occurredEvent = {
          name,
          version: 1,
          coffee: {
            id: 123,
            additions: ["milk", "sugar"]
          }
        };
        const context = configuredEvent.getContext(occurredEvent);
        expect(context)
          .to.deep.equal({
            foreignId: occurredEvent.coffee.id,
            additions: occurredEvent.coffee.additions
          });
      });
    });

    describe("when there isn't an exact version match but there is an older one", () => {
      it("should map the context", () => {
        const maps = [
          new ConfiguredEventVersionMap({
            source: "coffee.id",
            target: "foreignId"
          })
        ];
        configuredEvent.configureVersion({
          number: 1,
          maps: maps
        });
        const occurredEvent = {
          name,
          version: 2,
          coffee: {
            id: 123
          }
        };
        const context = configuredEvent.getContext(occurredEvent);
        expect(context)
          .to.deep.equal({
            foreignId: occurredEvent.coffee.id
          });
      });
    });

    describe("when there isn't an exact version match but there is an older one and a newer one", () => {
      it("should not use the older version", () => {
        configuredEvent.configureVersion({
          number: 3,
          maps: [
            new ConfiguredEventVersionMap({
              source: "coffee.id",
              target: "foreignId"
            }),
            new ConfiguredEventVersionMap({
              source: "coffee.isHot",
              target: "coffee.isHot"
            })
          ]
        });
        configuredEvent.configureVersion({
          number: 1,
          maps: [
            new ConfiguredEventVersionMap({
              source: "coffee.id",
              target: "foreignId"
            }),
            new ConfiguredEventVersionMap({
              source: "coffee.isHot",
              target: "isHot"
            })
          ]
        });
        const occurredEvent = {
          name,
          version: 2,
          coffee: {
            id: 123,
            isHot: true
          }
        };
        const context = configuredEvent.getContext(occurredEvent);
        expect(context)
          .to.deep.equal({
            foreignId: occurredEvent.coffee.id,
            isHot: occurredEvent.coffee.isHot
          });
      });
    });

    describe("when there is nothing except a newer version than the event that just occurred", () => {
      it("should throw an error", () => {
        configuredEvent.configureVersion({
          number: 2,
          maps: [
            new ConfiguredEventVersionMap({
              source: "coffee.id",
              target: "foreignId"
            })
          ]
        });
        const occurredEvent = {
          name,
          version: 1,
          coffee: {
            id: 123
          }
        };
        try {
          configuredEvent.getContext(occurredEvent);
        } catch (error) {
          expect(error)
            .to.exist;
        }
      });
    });
  });
});
