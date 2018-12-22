import { TaskStatus } from "../value-objects/task-status";
import { TeamMember } from "../value-objects/team-member";
import { Modification } from "../value-objects/modification";

interface TaskInterface {
  id: number;
  queueName: string;
  type: string;
  createdOn: Date;
  status: TaskStatus;
  dueOn: Date;
  assignee?: TeamMember;
}

export class Task implements TaskInterface {
  public id: number;
  public queueName: string;
  public type: string;
  public createdOn: Date;
  public status: TaskStatus;
  public dueOn: Date;
  public assignee?: TeamMember;

  constructor({
    id,
    queueName,
    type,
    createdOn,
    status,
    dueOn,
    assignee
  }: TaskInterface) {
    this.id = id;
    this.queueName = queueName;
    this.type = type;
    this.createdOn = createdOn;
    this.status = status;
    this.dueOn = dueOn;
    if (assignee) {
      this.assignee = new TeamMember(assignee);
    }
  }

  public get isComplete(): boolean {
    return this.status === TaskStatus.Completed;
  }

  public complete(): void {
    this.status = TaskStatus.Completed;
  }

  public assign(assignee: TeamMember): void {
    this.assignee = assignee;
    this.status = TaskStatus.Assigned;
  }

  public unassign(): void {
    delete this.assignee;
    this.status = TaskStatus.Unassigned;
  }

  public applyModification(modification?: Modification): void {
    if (modification) {
      this.dueOn = modification.getModifiedDueOn(this.dueOn);
    }
  }
}
