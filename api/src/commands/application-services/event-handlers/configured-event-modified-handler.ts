import { DomainEvents } from "../../infrastructure/kafka/domain-events";

// TODO: unit test
export class ConfiguredEventModifiedHandler {
  constructor(
    private domainEvents: DomainEvents,
    private reregister: () => Promise<void>
  ) {}

  public async register() {
    const handler = async () => {
      await this.reregister();
    };
    this.domainEvents.listenToBroadcast(
      "team-queues.configured-event-modified",
      handler
    );
  }
}
