import uuidv4 from "uuid/v4";
// TODO: exponential backoffs
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

    const addSubscription = ({ eventName, handler, handleOnce }) => {
      const topic = getTopic(eventName);
      if (!subscriptions[topic]) {
        subscriptions[topic] = {
          pubsub: {
            consumer: null,
            events: {}
          },
          broadcast: {
            consumer: null,
            events: {}
          }
        };
      }
      if (handleOnce) {
        if (!subscriptions[topic].pubsub.events[eventName]) {
          subscriptions[topic].pubsub.events[eventName] = {
            handlers: []
          };
        }
        subscriptions[topic].pubsub.events[eventName].handlers.push(handler);
      } else {
        if (!subscriptions[topic].broadcast.events[eventName]) {
          subscriptions[topic].broadcast.events[eventName] = {
            handlers: []
          };
        }
        subscriptions[topic].broadcast.events[eventName].handlers.push(handler);
      }
    };

    const createConsumer = (topic, isBroadcast, events) => {
      return new Promise((resolve, reject) => {
        const consumer = new kafka.KafkaConsumer({
          "group.id": isBroadcast ? uuidv4() : "team-queues",
          "auto.offset.reset": isBroadcast ? "latest" : "earliest",
          "metadata.broker.list": brokerLocation
        });
        consumer.connect();

        consumer.on("ready", () => {
          console.debug(`the kafka consumer is waiting for ${isBroadcast ? "broadcasts" : "events"} on topic ${topic}`);
          consumer.subscribe([topic]);
          setInterval(() => {
            consumer.consume(1);
          }, 1000);
          resolve(consumer);
        });

        consumer.on("data", (data) => {
          const event = JSON.parse(data.value.toString());
          const eventSubscriptions = events[event.name];
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
          reject(error);
        });

        consumer.on("error", (error) => {
          console.error(error);
        });
      });
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
              // TODO: partitition by aggregate id
              const partition = null;
              try {
                producer.produce(topic, partition, Buffer.from(JSON.stringify(event)));
              } catch (error) {
                console.error(error);
              }
            });
        },
        listenAndHandleOnce: (eventName, handler) => {
          console.debug(`listening to the ${eventName} event`);
          addSubscription({
            eventName,
            handler,
            handleOnce: true
          });
        },
        listenToBroadcast: (eventName, handler) => {
          // TODO: unit test
          // TODO: this will be used to update configured events and lifecycles in application-services
          console.debug(`listenting to the ${eventName} broadcast`);
          addSubscription({
            eventName,
            handler,
            handleOnce: false
          });
        },
        ignore: (eventName) => {
          const topic = getTopic(eventName);
          if (subscriptions[topic]) {
            if (subscriptions[topic].pubsub.events[eventName]) {
              console.debug(`ignoring the ${eventName} event`);
              delete subscriptions[topic].pubsub.events[eventName];
            }
            if (subscriptions[topic].broadcast.events[eventName]) {
              console.debug(`ignoring the ${eventName} broadcast`);
              delete subscriptions[topic].broadcast.events[eventName];
            }
          }
        },
        start: async () => {
          for (const topic of Object.keys(subscriptions)) {
            if (Object.keys(subscriptions[topic].pubsub.events)
              .length) {
              const isBroadcast = false;
              const events = subscriptions[topic].pubsub.events;
              const consumer = await createConsumer(topic, isBroadcast, events);
              subscriptions[topic].pubsub.consumer = consumer;
            }
            if (Object.keys(subscriptions[topic].broadcast.events)
              .length) {
              const isBroadcast = true;
              const events = subscriptions[topic].broadcast.events;
              const consumer = await createConsumer(topic, isBroadcast, events);
              subscriptions[topic].broadcast.consumer = consumer;
            }
          }
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
