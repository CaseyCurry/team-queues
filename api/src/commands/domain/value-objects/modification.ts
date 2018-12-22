import deepFreeze from "deep-freeze";

export interface ModificationInterface {
  text: string;
}

export class Modification {
  public text: string;
  private regEx: RegExp = new RegExp("\\d+");
  private operator: string;
  private modificationText: string;

  constructor({ text }: ModificationInterface) {
    this.validate(text);
    this.text = text;
    const modificationSegments = this.text.split(" ");
    this.operator = modificationSegments[1]!;
    this.modificationText = modificationSegments[2]!;
    deepFreeze(this);
  }

  // FIXME: move to Task
  public getModifiedDueOn(originalDueOn: Date): Date {
    const value = parseInt(this.modificationText.match(this.regEx)![0], 0);
    if (this.modificationText.startsWith("@minute")) {
      return this.operator === "+"
        ? new Date(originalDueOn.getTime() + value * 60000)
        : new Date(originalDueOn.getTime() - value * 60000);
    } else {
      return this.operator === "+"
        ? new Date(originalDueOn.getTime() + value * 60000 * 60)
        : new Date(originalDueOn.getTime() - value * 60000 * 60);
    }
  }

  private validate(text: string) {
    const modificationSegments = text.split(" ");
    if (modificationSegments.length !== 3) {
      throw new Error("the modification is syntactically incorrect");
    }
    const errorMessages = [];
    if (modificationSegments[0] !== "dueOn") {
      errorMessages.push("modifications are only available on the dueOn field");
    }
    if (modificationSegments[1] !== "+" && modificationSegments[1] !== "-") {
      errorMessages.push("only + and - are valid operators");
    }
    if (
      !(
        modificationSegments[2].startsWith("@minute(") &&
        modificationSegments[2].endsWith(")")
      ) &&
      !(
        modificationSegments[2].startsWith("@hour(") &&
        modificationSegments[2].endsWith(")")
      )
    ) {
      errorMessages.push("only @minute(n) and @hour(n) are valid operands");
    }
    if (!this.regEx.test(modificationSegments[2])) {
      errorMessages.push(
        "a number must be passed in the following form @minute(n) or @hour(n)"
      );
    }
    if (errorMessages.length) {
      throw new Error(errorMessages.toString());
    }
  }
}
