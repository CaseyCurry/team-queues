import deepFreeze from "deep-freeze";

const regEx = new RegExp("\\d+");

const Modification = class {
  constructor({ text }) {
    validate(text);
    this.text = text;
    deepFreeze(this);
  }

  getModifiedDueOn(originalDueOn) {
    const modificationSegments = this.text.split(" ");
    const operator = modificationSegments[1];
    const timeModification = modificationSegments[2];
    const timeValue = parseInt(timeModification.match(regEx));
    if (timeModification.startsWith("@minute")) {
      return operator === "+"
        ? new Date(originalDueOn.getTime() + timeValue * 60000)
        : new Date(originalDueOn.getTime() - timeValue * 60000);
    } else {
      return operator === "+"
        ? new Date(originalDueOn.getTime() + timeValue * 60000 * 60)
        : new Date(originalDueOn.getTime() - timeValue * 60000 * 60);
    }
  }
};

const validate = text => {
  if (!text || typeof text !== "string") {
    throw new Error("The text must have a string value");
  }
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
  if (!regEx.test(modificationSegments[2])) {
    errorMessages.push(
      "a number must be passed in the following form @minute(n) or @hour(n)"
    );
  }
  if (errorMessages.length) {
    throw new Error(errorMessages);
  }
};

export { Modification };
