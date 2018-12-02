import deepFreeze from "deep-freeze";

// TODO: unit test
const TaskStatus = deepFreeze({
  Unassigned: "Unassigned",
  Assigned: "Assigned",
  Completed: "Completed"
});

export { TaskStatus };
