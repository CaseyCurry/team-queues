import deepFreeze from "deep-freeze";

const TaskStatus = deepFreeze({
  Unassigned: "Unassigned",
  Assigned: "Assigned",
  Completed: "Completed"
});

export { TaskStatus };
