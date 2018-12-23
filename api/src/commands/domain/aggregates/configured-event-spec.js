import { expect } from "chai";
import { ConfiguredEvent } from "./configured-event";
import { ConfiguredEventVersionMap } from "../value-objects/configured-event-version-map";

describe("configured event suite", () => {
  const name = "coffee-ordered";
  const isActive = true;
  const versions = [
    {
      number: 1,
      maps: [
        new ConfiguredEventVersionMap({
          source: "coffeeId",
          target: "foreignId"
        })
      ]
    }
  ];
  let configuredEvent;

  describe("when configured event is created", () => {
    beforeEach(() => {
      configuredEvent = new ConfiguredEvent({ name, isActive, versions });
    });

    it("should create an event with the name", () => {
      expect(configuredEvent.name).to.equal(name);
    });

    it("should create an event with the active flag", () => {
      expect(configuredEvent.isActive).to.equal(isActive);
    });

    it("should create an event with the versions", () => {
      expect(configuredEvent.versions).to.deep.equal(versions);
    });
  });

  xdescribe("when getting the context from the event", () => {
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
        configuredEvent = new ConfiguredEvent({
          name,
          isActive,
          versions: [
            {
              number: 1,
              maps: maps
            }
          ]
        });
        occurredEvent = {
          name,
          version: 1,
          coffeeId: 123
        };
        context = configuredEvent.getContext(occurredEvent);
      });

      it("should map the context", () => {
        expect(context.foreignId).to.equal(occurredEvent.coffeeId);
      });

      describe("when there is an exact version match", () => {
        it("should map the context", () => {
          expect(context.foreignId).to.equal(occurredEvent.coffeeId);
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
        configuredEvent = new ConfiguredEvent({
          name,
          isActive,
          versions: [
            {
              number: 1,
              maps: maps
            }
          ]
        });
        const occurredEvent = {
          name,
          version: 1,
          coffee: { id: 123 }
        };
        const context = configuredEvent.getContext(occurredEvent);
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
        configuredEvent = new ConfiguredEvent({
          name,
          isActive,
          versions: [
            {
              number: 1,
              maps: maps
            }
          ]
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
        configuredEvent = new ConfiguredEvent({
          name,
          isActive,
          versions: [
            {
              number: 1,
              maps: maps
            }
          ]
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
        configuredEvent = new ConfiguredEvent({
          name,
          isActive,
          versions: [
            {
              number: 1,
              maps: maps
            }
          ]
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
        configuredEvent = new ConfiguredEvent({
          name,
          isActive,
          versions: [
            {
              number: 1,
              maps: maps
            }
          ]
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
        expect(context).to.deep.equal({
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
        configuredEvent = new ConfiguredEvent({
          name,
          isActive,
          versions: [
            {
              number: 1,
              maps: maps
            }
          ]
        });
        const occurredEvent = {
          name,
          version: 2,
          coffee: {
            id: 123
          }
        };
        const context = configuredEvent.getContext(occurredEvent);
        expect(context).to.deep.equal({
          foreignId: occurredEvent.coffee.id
        });
      });
    });

    describe("when there isn't an exact version match but there is an older one and a newer one", () => {
      it("should not use the older version", () => {
        configuredEvent = new ConfiguredEvent({
          name,
          isActive,
          versions: [
            {
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
            },
            {
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
            }
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
        expect(context).to.deep.equal({
          foreignId: occurredEvent.coffee.id,
          isHot: occurredEvent.coffee.isHot
        });
      });
    });

    describe("when there is nothing except a newer version than the event that just occurred", () => {
      it("should throw an error", () => {
        configuredEvent = new ConfiguredEvent({
          name,
          isActive,
          versions: [
            {
              number: 2,
              maps: [
                new ConfiguredEventVersionMap({
                  source: "coffee.id",
                  target: "foreignId"
                })
              ]
            }
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
          expect(error).to.exist;
        }
      });
    });
  });
});
