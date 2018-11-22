import deepFreeze from "deep-freeze";

const LifecycleStatus = deepFreeze({
  Active: "Active",
  Inactive: "Inactive",
  WorkInProgress: "WorkInProgress"
});

export { LifecycleStatus };
