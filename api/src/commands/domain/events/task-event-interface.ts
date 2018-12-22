import { EventInterface } from "./event";

export interface TaskEventInterface extends EventInterface {
  message: {
    task: {
      id: number;
      item: {
        id: string;
      };
    };
  };
}
