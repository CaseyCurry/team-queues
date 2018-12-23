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

  describe("when an attempt is made to create an event with invalid arguments", () => {
    it("should throw an error if the name is null", () => {
      const name = null;
      try {
        new ConfiguredEvent({ name, isActive, versions });
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("should throw an error if the versions are null", () => {
      const versions = null;
      try {
        new ConfiguredEvent({ name, isActive, versions });
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("when getting the context from the event", () => {
    describe("when there is an exact version match", () => {
      const maps = [
        new ConfiguredEventVersionMap({
          source: "coffeeId",
          target: "foreignId"
        })
      ];
      const configuredEvent = new ConfiguredEvent({
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
        coffeeId: 456
      };

      it("should map the context", () => {
        const context = configuredEvent.getContext(occurredEvent);
        expect(context.foreignId).to.equal(occurredEvent.coffeeId);
      });

      describe("when an event is processed for the second time", () => {
        it("should use the version previously determined to be the best version", () => {
          const firstContext = configuredEvent.getContext(occurredEvent);
          const secondOccurredEvent = {
            name,
            version: 1,
            coffeeId: 456
          };
          const secondContext = configuredEvent.getContext(secondOccurredEvent);
          expect(secondContext.foreignId).to.equal(
            secondOccurredEvent.coffeeId
          );
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
        const configuredEvent = new ConfiguredEvent({
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
        const configuredEvent = new ConfiguredEvent({
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
        const configuredEvent = new ConfiguredEvent({
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

    describe("when the occurred event name is not the configured event name", () => {
      it("should throw an error", () => {
        const configuredEvent = new ConfiguredEvent({
          name,
          isActive,
          versions: [
            {
              number: 1,
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
          name: name + "x",
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
