import { expect } from "chai";
import { TriggeredCompletion } from "./triggered-completion";

describe("triggered completion suite", () => {
  describe("when a triggered completion is created", () => {
    let triggeredCompletion: TriggeredCompletion;
    const eventNames = ["delivery.coffee-delivered"];
    const doesCompletePreviousTask = true;
    const doesCompleteItem = true;

    beforeEach(() => {
      triggeredCompletion = new TriggeredCompletion({
        eventNames,
        doesCompletePreviousTask,
        doesCompleteItem
      });
    });

    it("should include the event names", () => {
      expect(triggeredCompletion.eventNames).to.deep.equal(eventNames);
    });

    it("should include the flag indicating the trigger should complete the previous task", () => {
      expect(triggeredCompletion.doesCompletePreviousTask).to.equal(
        doesCompletePreviousTask
      );
    });

    it("should include the flag indicating the trigger should complete the item", () => {
      expect(triggeredCompletion.doesCompleteItem).to.equal(doesCompleteItem);
    });

    it("should be immutable", () => {
      expect(Object.isFrozen(triggeredCompletion)).to.equal(true);
    });

    describe("when the triggered completion only listens for the delivery.coffee-delivered event", () => {
      it("should report the delivery.coffee-delivered event is listened for", () => {
        expect(
          triggeredCompletion.listensFor("delivery.coffee-delivered")
        ).to.equal(true);
      });

      it("should not report the xdelivery.coffee-delivered event is listened for", () => {
        expect(
          triggeredCompletion.listensFor("xdelivery.coffee-delivered")
        ).to.equal(false);
      });
    });
  });
});
