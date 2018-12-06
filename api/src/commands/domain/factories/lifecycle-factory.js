import validate from "uuid-validate";
import { Lifecycle } from "../aggregates/lifecycle";

// TODO: unit test
const LifecycleFactory = {
  create: ({
    id,
    lifecycleOf
  }) => {
    // Do not generate the lifecycle id here because it demotes idempotency. Force the client to generate an id.
    const errorMessages = [];
    if (!id || !validate(id)) {
      errorMessages.push("The id must have a value and must be a v4 uuid");
    }
    if (!lifecycleOf || typeof lifecycleOf !== "string") {
      errorMessages.push("The lifecycleOf must have a value and must be a string");
    }
    if (errorMessages.length) {
      throw new Error(errorMessages);
    }
    const lifecycle = new Lifecycle({
      id,
      lifecycleOf
    });
    return lifecycle;
  }
};

export { LifecycleFactory };
