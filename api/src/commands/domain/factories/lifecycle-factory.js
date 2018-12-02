import { Lifecycle } from "../aggregates/lifecycle";

// TODO: unit test
const LifecycleFactory = {
  create: ({
    id,
    lifecycleOf
  }) => {
    // Do not generate the lifecycle id here because it demotes idempotency. Force the client to generate an id.
    const lifecycle = new Lifecycle({
      id,
      lifecycleOf
    });
    return lifecycle;
  }
};

export { LifecycleFactory };
