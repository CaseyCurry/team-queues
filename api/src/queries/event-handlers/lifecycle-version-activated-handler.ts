import { DomainEvents } from "../../commands/infrastructure/kafka/domain-events";
import { QueueData } from "../dal/queue-data";

// TODO: With the new model for lifecycles is the read model different enough to warrant CQRS?
export class LifecycleVersionActivatedHandler {
  constructor(
    private domainEvents: DomainEvents,
    private queueData: QueueData
  ) {}

  public async register() {
    this.domainEvents.listenAndHandleOnce(
      "team-queues.lifecycle-version-activated",
      this.handler
    );
  }

  private async handler(event: any): Promise<void> {
    const lifecycle = event.message.lifecycle;
    console.debug(
      `handling ${event.name} for lifecycle ${lifecycle.id} version ${
        lifecycle.version.number
      }`
    );
    const queues = lifecycle.version.queues.map((queue: any) => {
      return {
        lifecycleId: lifecycle.id,
        lifecycleOf: lifecycle.lifecycleOf,
        queueName: queue.name,
        taskType: queue.taskType
      };
    });
    await this.queueData.deleteByLifecycle(lifecycle.id);
    if (queues.length) {
      await this.queueData.createMany(queues);
    }
  }
}
