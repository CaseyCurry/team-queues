import { v4 as uuidv4 } from "uuid";
import { TaskStatus } from "../value-objects/task-status";

// TODO: unit test
const Task = class {
  constructor({ id, itemId, queueName, type, createdOn, status, dueOn, assignee }) {
    this.id = id ? id : uuidv4();
    this.itemId = itemId;
    this.queueName = queueName;
    this.type = type;
    this.createdOn = createdOn;
    this.status = status;
    this.dueOn = dueOn;
    this.assignee = assignee;
  }

  get isComplete() {
    return this.status === TaskStatus.Completed;
  }

  completeTask() {
    this.status = TaskStatus.Completed;
  }

  assignTask(assignee) {
    this.assignee = assignee;
  }

  unassignTask() {
    this.assignee = null;
  }

  applyModification(modification) {
    if (modification) {
      modification.modify(this);
    }
  }
};

export { Task };
