import { expect } from "chai";
import { TriggeredDestination } from "./triggered-destination";
import { UnconditionalDestination } from "./unconditional-destination";

describe("triggered destination suite", () => {
  describe("when a destination is created", () => {
    let triggeredDestination: TriggeredDestination;
    const eventNames = ["delivery.coffee-delivered"];
    const destinations = [
      new UnconditionalDestination({
        queueName: "Barista Queue",
        taskType: "Make Coffee",
        modification: undefined,
        doesCompletePreviousTask: false
      })
    ];

    beforeEach(() => {
      triggeredDestination = new TriggeredDestination({
        eventNames,
        destinations
      });
    });

    it("should include the event names", () => {
      expect(triggeredDestination.eventNames).to.deep.equal(eventNames);
    });

    it("should include the destinations", () => {
      expect(triggeredDestination.destinations).to.deep.equal(destinations);
    });

    it("should be immutable", () => {
      expect(Object.isFrozen(triggeredDestination)).to.equal(true);
    });

    describe("when the triggered destination only listens for the delivery.coffee-delivered event", () => {
      it("should report the delivery.coffee-delivered event is listened for", () => {
        expect(
          triggeredDestination.listensFor("delivery.coffee-delivered")
        ).to.equal(true);
      });

      it("should not report the xdelivery.coffee-delivered event is listened for", () => {
        expect(
          triggeredDestination.listensFor("xdelivery.coffee-delivered")
        ).to.equal(false);
      });
    });
  });
});
