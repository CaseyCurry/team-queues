import deepFreeze from "deep-freeze";
import validate from "uuid-validate";
import { Modification } from "./modification";

const UnconditionalDestination = class {
  constructor({ queueId, modification, doesCompletePreviousTask }) {
    if (!queueId || !validate(queueId)) {
      throw new Error("The queueId must be a v4 uuid");
    }
    this.queueId = queueId;
    if (modification) {
      this.modification = new Modification(modification);
    }
    this.doesCompletePreviousTask = doesCompletePreviousTask ? true : false;
    deepFreeze(this);
  }
};

export { UnconditionalDestination };