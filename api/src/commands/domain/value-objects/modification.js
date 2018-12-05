import deepFreeze from "deep-freeze";

const Modification = class {
  constructor({ text }) {
    this.text = text;
    validate.call(this);
    deepFreeze(this);
  }

  modify(task) {
    const modificationSegments = this.text.split(" ");
    const regEx = new RegExp("\\d+");
    task.dueOn =
      getModifiedDueOn(task.dueOn, modificationSegments[1], modificationSegments[2], regEx);
  }
};

const validate = function() {
  if (!this.text || typeof this.text !== "string") {
    throw new Error("The text must have a string value");
  }
  const modificationSegments = this.text.split(" ");
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
  if (!(modificationSegments[2].startsWith("@minute(") && modificationSegments[2].endsWith(")")) &&
    !(modificationSegments[2].startsWith("@hour(") && modificationSegments[2].endsWith(")"))) {
    errorMessages.push("only @minute(n) and @hour(n) are valid operands");
  }
  const regEx = new RegExp("\\d+");
  if (!regEx.test(modificationSegments[2])) {
    errorMessages.push("a number must be passed in the following form @minute(n) or @hour(n)");
  }
  if (errorMessages.length) {
    throw new Error(errorMessages);
  }
};

const getModifiedDueOn = (originalDueOn, operator, modification, regEx) => {
  const value = parseInt(modification.match(regEx));
  if (modification.startsWith("@minute")) {
    return operator === "+" ?
      new Date(originalDueOn.getTime() + (value * 60000)) :
      new Date(originalDueOn.getTime() - (value * 60000));
  } else {
    return operator === "+" ?
      new Date(originalDueOn.getTime() + (value * 60000 * 60)) :
      new Date(originalDueOn.getTime() - (value * 60000 * 60));
  }
};

export { Modification };
