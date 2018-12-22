import { DomainEvents } from "../../infrastructure/kafka/domain-events";

// TODO: unit test
export class LifecycleVersionActivatedHandler {
  constructor(
    private domainEvents: DomainEvents,
    private reregister: () => Promise<void>
  ) {}

  public async register() {
    const handler = async () => {
      await this.reregister();
    };
    this.domainEvents.listenToBroadcast(
      "team-queues.lifecycle-version-activated",
      handler
    );
  }
}
