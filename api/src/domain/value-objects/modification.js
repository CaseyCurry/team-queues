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
    task.dueOn.setMinutes(
      getModifiedDueOn(task.dueOn, modificationSegments[1], modificationSegments[2], regEx));
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
  if (modificationSegments[0] !== "dueOn") {
    throw new Error("modifications are only available on the dueOn field");
  }
  if (modificationSegments[1] !== "+" && modificationSegments[1] !== "-") {
    throw new Error("only + and - are valid operators");
  }
  if (!(modificationSegments[2].startsWith("@minute(") && modificationSegments[2].endsWith(")")) &&
    !(modificationSegments[2].startsWith("@hour(") && modificationSegments[2].endsWith(")"))) {
    throw new Error("only @minute(n) and @hour(n) are valid operands");
  }
  const regEx = new RegExp("\\d+");
  if (!regEx.test(modificationSegments[2])) {
    throw new Error("a number must be passed in the following form @minute(n) or @hour(n)");
  }
};

const getModifiedDueOn = (originalDueOn, operator, modification, regEx) => {
  const value = parseInt(modification.match(regEx));
  if (modification.startsWith("@minute")) {
    return operator === "+" ?
      originalDueOn.getMinutes() + value :
      originalDueOn.getMinutes() - value;
  } else {
    return operator === "+" ?
      originalDueOn.getMinutes() + (value * 60) :
      originalDueOn.getMinutes() - (value * 60);
  }
};

export { Modification };