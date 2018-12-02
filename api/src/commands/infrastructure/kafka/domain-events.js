import { v4 as uuidv4 } from "uuid";

// TODO: exponential backoffs
// TODO: poison messages
// TODO: research kafka best practices
const DomainEvents = (kafka) => {
  return new Promise((resolve, reject) => {
    let subscriptions = {};
    // TODO: pass config to client
    const brokerLocation = "localhost:9092";
    const producerClient = new kafka.KafkaClient();
    const producer = new kafka.Producer(producerClient);

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
          const payload = events
            .map((event) => event.name)
            .filter((x, y, z) => z.indexOf(x) === y)
            .map((eventName) => {
              const messages = events
                .filter((event) => event.name === eventName)
                .map((event) => JSON.stringify(event));
              return {
                topic: eventName,
                messages,
                partition: 0
              };
            });
          console.debug(`raising the ${payload[0].topic} event`);
          producer.send(payload, (error) => {
            if (error) {
              console.error(error);
            }
          });
        },
        listenAndHandleOnce: (eventName, handler) => {
          console.debug(`subscribing to the ${eventName} event`);
          if (!subscriptions[eventName]) {
            subscriptions[eventName] = {
              handlers: [],
              handleOnce: true
            };
          }
          subscriptions[eventName].handlers.push(handler);
        },
        listenToBroadcast: (eventName, handler) => {
          // TODO: unit test
          // TODO: this will be used to update configured events and lifecycles in application-services
          console.debug(`subscribing to the ${eventName} event`);
          if (!subscriptions[eventName]) {
            subscriptions[eventName] = {
              handlers: [],
              handleOnce: false
            };
          }
          subscriptions[eventName].handlers.push(handler);
        },
        start: () => {
          const groupIdForBroadcastClients = uuidv4();
          Object.keys(subscriptions)
            .forEach((eventName) => {
              console.debug(`the kafka consumer is waiting for the ${eventName} event`);
              const consumer = new kafka.ConsumerGroup({
                kafkaHost: brokerLocation,
                groupId: subscriptions[eventName].handleOnce ?
                  "team-queues" : groupIdForBroadcastClients,
                autoCommit: true,
                fromOffset: "latest"
              }, eventName);
              subscriptions[eventName].consumer = consumer;
              consumer.on("message", (message) => {
                console.debug(`event ${message.topic} occurred`);
                for (const handler of subscriptions[message.topic].handlers) {
                  const event = JSON.parse(message.value);
                  handler(event)
                    .catch((error) => {
                      console.error(error);
                    });
                }
              });
              consumer.on("error", (error) => {
                console.error(error);
              });
            });
        },
        end: end
      });
    });

    producer.on("error", function(error) {
      reject(error);
    });

    const end = () => {
      if (Object.keys(subscriptions)
        .length) {
        producer.close();
        producerClient.close((error) => {
          if (error) {
            console.error(error);
          }
        });
        Object.keys(subscriptions)
          .forEach((eventName) => {
            subscriptions[eventName].consumer.close(true, (error) => {
              if (error) {
                console.error(error);
              }
            });
          });
        subscriptions = {};
      }
    };

    process.once("SIGINT", end);
  });
};

export { DomainEvents };
