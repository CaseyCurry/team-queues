declare module "json-rules-engine" {
  export class Engine {
    public addRule({ conditions, event }: any): void;
    public run(facts: any): Promise<any[]>;
  }
}
