// TODO: support broadcasts
// TODO: exponential backoffs
// TODO: partitition by aggregate id
// TODO: poison messages
// TODO: research kafka best practices
const DomainEvents = (kafka) => {
  return new Promise((resolve, reject) => {
    let subscriptions = {};
    // TODO: pass config to client
    const brokerLocation = "localhost:9092";
    const producer = new kafka.Producer({
      "client.id": "team-queues",
      "metadata.broker.list": brokerLocation,
      "max.in.flight.requests.per.connection": 1
    });

    const getTopic = (eventName) => {
      return eventName.split(".")[0];
    };

    const addSubscription = (eventName, handler) => {
      const topic = getTopic(eventName);
      if (!subscriptions[topic]) {
        subscriptions[topic] = {
          events: {}
        };
      }
      if (!subscriptions[topic][eventName]) {
        subscriptions[topic][eventName] = {
          handlers: []
        };
      }
      subscriptions[topic][eventName].handlers.push(handler);
    };

    producer.connect();

    producer.on("ready", () => {
      console.debug(`the kafka producer is ready to send messages to ${brokerLocation}`);
      resolve({
        raise: (events) => {
          if (events && !Array.isArray(events)) {
            events = [events];
          }
          if (!events || !Array.isArray(events) || !events.length) {
            return;
          }
          // make sure events are sent in the order of occurrence
          events
            .sort((x, y) => x.occurredOn < y.occurredOn ? -1 : 1)
            .forEach((event) => {
              const topic = getTopic(event.name);
              console.debug(`raising the ${event.name} event with id ${event.id} on topic ${topic}`);
              const partition = null;
              try {
                producer.produce(topic, partition, Buffer.from(JSON.stringify(event)));
              } catch (error) {
                console.error(error);
              }
            });
        },
        listenAndHandleOnce: (eventName, handler) => {
          console.debug(`subscribing to the ${eventName} event`);
          addSubscription(eventName, handler, true);
        },
        listenToBroadcast: (eventName, handler) => {
          // TODO: unit test
          // TODO: this will be used to update configured events and lifecycles in application-services
          console.debug(`subscribing to the ${eventName} event`);
          addSubscription(eventName, handler, false);
        },
        start: () => {
          Object.keys(subscriptions)
            .forEach((topic) => {
              console.debug(`the kafka consumer is waiting for events on topic ${topic}`);

              const consumer = new kafka.KafkaConsumer({
                "group.id": "kafka",
                "metadata.broker.list": brokerLocation
              });
              subscriptions[topic].consumer = consumer;
              consumer.connect();

              consumer.on("ready", () => {
                consumer.subscribe([topic]);
                setInterval(() => {
                  consumer.consume(1);
                }, 1000);
              });

              consumer.on("data", (data) => {
                const event = JSON.parse(data.value.toString());
                const eventSubscriptions = subscriptions[topic][event.name];
                if (!eventSubscriptions) {
                  return;
                }
                console.debug(`event ${event.name} occurred with id ${event.id}`);
                for (const handler of eventSubscriptions.handlers) {
                  handler(event)
                    .catch((error) => {
                      console.error(error);
                      // TODO: What needs to happen here to force a retry?
                    });
                  console.debug(`event ${event.id} handled`);
                }
              });

              consumer.on("event.error", (error) => {
                console.error(error);
              });

              consumer.on("error", (error) => {
                console.error(error);
              });
            });
        },
        end: end
      });
    });

    producer.on("event.error", function(error) {
      reject(error);
    });

    const end = () => {
      if (Object.keys(subscriptions)
        .length) {
        producer.disconnect();
        Object.keys(subscriptions)
          .forEach((topic) => {
            subscriptions[topic].consumer.disconnect();
          });
        subscriptions = {};
      }
    };

    process.once("SIGINT", end);
  });
};

export { DomainEvents };
