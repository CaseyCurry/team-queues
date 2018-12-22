import { expect } from "chai";
import { Modification } from "./modification";
import { Task } from "../entities/task";
import { TaskStatus } from "./task-status";

describe("modification suite", () => {
  describe("when a modification is created", () => {
    let modification: Modification;
    let text = "dueOn + @minute(1)";

    beforeEach(() => {
      modification = new Modification({ text });
    });

    it("should include the text", () => {
      expect(modification.text).to.equal(text);
    });

    it("should be immutable", () => {
      expect(Object.isFrozen(modification)).to.equal(true);
    });

    describe("when a task is modified to add 1 minute to the due on date", () => {
      it("should add 1 minute", () => {
        const originalDueOn = new Date();
        const modifiedDueOn = modification.getModifiedDueOn(originalDueOn);
        expect(modifiedDueOn).to.deep.equal(
          new Date(originalDueOn.getTime() + 1 * 60000)
        );
      });
    });

    describe("when a task is modified to subtract 1 minute to the due on date", () => {
      it("should subtract 1 minute", () => {
        text = "dueOn - @minute(1)";
        modification = new Modification({ text });
        const originalDueOn = new Date();
        const modifiedDueOn = modification.getModifiedDueOn(originalDueOn);
        expect(modifiedDueOn).to.deep.equal(
          new Date(originalDueOn.getTime() - 1 * 60000)
        );
      });
    });

    describe("when a task is modified to add 1 hour to the due on date", () => {
      it("should add 1 hour", () => {
        text = "dueOn + @hour(1)";
        modification = new Modification({ text });
        const originalDueOn = new Date();
        const modifiedDueOn = modification.getModifiedDueOn(originalDueOn);
        expect(modifiedDueOn).to.deep.equal(
          new Date(originalDueOn.getTime() + 1 * 60000 * 60)
        );
      });
    });

    describe("when a task is modified to subtract 1 hour to the due on date", () => {
      it("should subtract 1 hour", () => {
        text = "dueOn - @hour(1)";
        modification = new Modification({ text });
        const originalDueOn = new Date();
        const modifiedDueOn = modification.getModifiedDueOn(originalDueOn);
        expect(modifiedDueOn).to.deep.equal(
          new Date(originalDueOn.getTime() - 1 * 60000 * 60)
        );
      });
    });
  });

  describe("when an attempt is made to create a modification with invalid arguments", () => {
    it("should throw an error if the text is not three segments seperated by a space", () => {
      const text = "x + dueOn + @minute(1)";
      try {
        new Modification({ text });
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("should throw an error if the text does not have dueOn as the first segment", () => {
      const text = "xDueOn + @minute(1)";
      try {
        new Modification({ text });
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("should throw an error if the text does not have a valid operator", () => {
      const text = "dueOn * @minute(1)";
      try {
        new Modification({ text });
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("should throw an error if the text does not have either @minute(n) or @hour(n) in the third segment", () => {
      const text = "dueOn + @day(1)";
      try {
        new Modification({ text });
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("should throw an error if the text does not have a valid argument passed to @minute(n)", () => {
      const text = "dueOn + @minute(x)";
      try {
        new Modification({ text });
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
});
