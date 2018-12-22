import { v4 as uuidv4 } from "uuid";

// TODO: exponential backoffs
// TODO: poison messages
// TODO: research kafka best practices
export class DomainEvents {
  private subscriptions: any = {};
  // FIXME: config this
  private readonly brokerLocation: string = "localhost:9092";
  private readonly producer: any;

  constructor(private kafka: any) {
    this.producer = new this.kafka.Producer({
      "client.id": "team-queues",
      "metadata.broker.list": this.brokerLocation,
      "max.in.flight.requests.per.connection": 1
    });
  }

  public initialize(): Promise<void> {
    this.producer.connect();

    process.once("SIGINT", this.end);

    return new Promise((resolve, reject) => {
      this.producer.on("ready", () => {
        console.debug(
          `the kafka producer is ready to send messages to ${
            this.brokerLocation
          }`
        );
        resolve();
      });

      this.producer.on("event.error", (error: Error) => {
        reject(error);
      });
    });
  }

  public raise(event: any) {
    if (!event) {
      throw new Error("an event must be passed");
    }
    const topic = this.getTopic(event.name);
    console.debug(
      `raising the ${event.name} event with id ${event.id} on topic ${topic}`
    );
    // TODO: partitition by aggregate id
    const partition = null;
    try {
      this.producer.produce(
        topic,
        partition,
        Buffer.from(JSON.stringify(event))
      );
    } catch (error) {
      console.error(error);
    }
  }

  public listenAndHandleOnce(
    eventName: string,
    handler: (event: any) => Promise<any>
  ) {
    console.debug(`listening to the ${eventName} event`);
    this.addSubscription({
      eventName,
      handler,
      handleOnce: true
    });
  }

  public listenToBroadcast(
    eventName: string,
    handler: (event: any) => Promise<any>
  ) {
    console.debug(`listening to the ${eventName} broadcast`);
    this.addSubscription({
      eventName,
      handler,
      handleOnce: false
    });
  }

  public ignore(eventName: string) {
    const topic = this.getTopic(eventName);
    if (this.subscriptions[topic]) {
      if (this.subscriptions[topic].pubsub.events[eventName]) {
        console.debug(`ignoring the ${eventName} event`);
        delete this.subscriptions[topic].pubsub.events[eventName];
      }
      if (this.subscriptions[topic].broadcast.events[eventName]) {
        console.debug(`ignoring the ${eventName} broadcast`);
        delete this.subscriptions[topic].broadcast.events[eventName];
      }
    }
  }

  public async start() {
    for (const topic of Object.keys(this.subscriptions)) {
      const hasEvents = Object.keys(this.subscriptions[topic].pubsub.events)
        .length;
      if (hasEvents) {
        /* This condition and the one like it below in the broadcast block of code,
           is helpful when ConfiguredEventsHandler.reregister is called.
           If a topic has already been subscribed, move on. Otherwise,
           a new domain has been included in a new ConfiguredEvent. */
        if (!this.subscriptions[topic].pubsub.isConsuming) {
          const isBroadcast = false;
          const events = this.subscriptions[topic].pubsub.events;
          this.subscriptions[topic].pubsub.isConsuming = true;
          this.subscriptions[topic].pubsub.cleanup = await this.createConsumer(
            topic,
            isBroadcast,
            events
          );
        }
      }
      const hasBroadcasts = Object.keys(
        this.subscriptions[topic].broadcast.events
      ).length;
      if (hasBroadcasts) {
        if (!this.subscriptions[topic].broadcast.isConsuming) {
          const isBroadcast = true;
          const events = this.subscriptions[topic].broadcast.events;
          this.subscriptions[topic].broadcast.isConsuming = true;
          this.subscriptions[
            topic
          ].broadcast.cleanup = await this.createConsumer(
            topic,
            isBroadcast,
            events
          );
        }
      }
    }
  }

  public end() {
    if (Object.keys(this.subscriptions).length) {
      this.producer.disconnect();
      Object.keys(this.subscriptions).forEach((topic: string) => {
        if (this.subscriptions[topic].pubsub.isConsuming) {
          this.subscriptions[topic].pubsub.cleanup();
        }
        if (this.subscriptions[topic].broadcast.isConsuming) {
          this.subscriptions[topic].broadcast.cleanup();
        }
      });
      this.subscriptions = {};
    }
  }

  private getTopic(eventName: string) {
    return eventName.split(".")[0];
  }

  private addSubscription({
    eventName,
    handler,
    handleOnce
  }: {
    eventName: string;
    handler: any;
    handleOnce: boolean;
  }) {
    const topic = this.getTopic(eventName);
    if (!this.subscriptions[topic]) {
      this.subscriptions[topic] = {
        pubsub: {
          isConsuming: false,
          cleanup: null,
          events: {}
        },
        broadcast: {
          isConsuming: false,
          cleanup: null,
          events: {}
        }
      };
    }
    if (handleOnce) {
      if (!this.subscriptions[topic].pubsub.events[eventName]) {
        this.subscriptions[topic].pubsub.events[eventName] = {
          handlers: []
        };
      }
      this.subscriptions[topic].pubsub.events[eventName].handlers.push(handler);
    } else {
      if (!this.subscriptions[topic].broadcast.events[eventName]) {
        this.subscriptions[topic].broadcast.events[eventName] = {
          handlers: []
        };
      }
      this.subscriptions[topic].broadcast.events[eventName].handlers.push(
        handler
      );
    }
  }

  private createConsumer(topic: string, isBroadcast: boolean, events: any[]) {
    return new Promise((resolve, reject) => {
      const consumer = new this.kafka.KafkaConsumer({
        "group.id": isBroadcast ? uuidv4() : "team-queues",
        "auto.offset.reset": isBroadcast ? "latest" : "earliest",
        "metadata.broker.list": this.brokerLocation
      });
      consumer.connect();

      consumer.on("ready", () => {
        console.debug(
          `the kafka consumer is waiting for ${
            isBroadcast ? "broadcasts" : "events"
          } on topic ${topic}`
        );
        consumer.subscribe([topic]);
        const poller = setInterval(() => {
          consumer.consume(1);
        }, 1000);
        resolve(() => {
          consumer.disconnect();
          clearInterval(poller);
        });
      });

      consumer.on("data", (data: any) => {
        const event = JSON.parse(data.value.toString());
        const eventSubscriptions = events[event.name];
        if (!eventSubscriptions) {
          return;
        }
        console.debug(`event ${event.name} occurred with id ${event.id}`);
        for (const handler of eventSubscriptions.handlers) {
          handler(event).catch((error: Error) => {
            console.error(error);
            // TODO: What needs to happen here to force a retry?
          });
          console.debug(`event ${event.id} handled`);
        }
      });

      consumer.on("event.error", (error: Error) => {
        reject(error);
      });

      consumer.on("error", (error: Error) => {
        console.error(error);
      });
    });
  }
}
