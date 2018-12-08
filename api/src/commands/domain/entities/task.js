import { TaskStatus } from "../value-objects/task-status";
import { TeamMember } from "../value-objects/team-member";

const Task = class {
  constructor({ id, itemId, queueName, type, createdOn, status, dueOn, assignee }) {
    this.id = id;
    this.itemId = itemId;
    this.queueName = queueName;
    this.type = type;
    this.createdOn = createdOn;
    this.status = status;
    this.dueOn = dueOn;
    if (assignee) {
      this.assignee = new TeamMember(assignee);
    }
  }

  get isComplete() {
    return this.status === TaskStatus.Completed;
  }

  complete() {
    this.status = TaskStatus.Completed;
  }

  assign(assignee) {
    this.assignee = assignee;
    this.status = TaskStatus.Assigned;
  }

  unassign() {
    this.assignee = null;
    this.status = TaskStatus.Unassigned;
  }

  applyModification(modification) {
    if (modification) {
      modification.modify(this);
    }
  }
};

export { Task };
