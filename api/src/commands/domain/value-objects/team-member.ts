import deepFreeze from "deep-freeze";

export interface TeamMemberInterface {
  name: string;
}

export class TeamMember implements TeamMemberInterface {
  public name: string;

  constructor({ name }: TeamMemberInterface) {
    this.name = name;
    deepFreeze(this);
  }
}
