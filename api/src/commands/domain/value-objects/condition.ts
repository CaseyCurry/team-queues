import deepFreeze from "deep-freeze";

export interface ConditionInterface {
  fact: string;
  path: string;
  operator: string;
  value: any;
}

export class Condition implements ConditionInterface {
  public fact: string;
  public path: string;
  public operator: string;
  public value: any;

  constructor({ fact, path, operator, value }: ConditionInterface) {
    // TODO: create enum of operators from this doc...
    // https://github.com/CacheControl/json-rules-engine/blob/28a5c8e558268b89e3b4a11bc879e4e339f029eb/docs/rules.md#operators
    this.fact = fact;
    this.path = path;
    this.operator = operator;
    this.value = value;
    deepFreeze(this);
  }
}
