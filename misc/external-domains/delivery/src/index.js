import express from "express";
import helmet from "helmet";
import kafka from "kafka-node";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(helmet());

// add a route for health checking the api
app.get("/", (request, response) => {
  response.end();
});

app.post("/orders/:id", async (request, response) => {
  const orderId = request.params.id;
  await raiseEvent(orderId);
  response.status(201)
    .send(orderId);
});

const port = process.env.PORT || 8095;
app.listen(port, () => {
  console.log(`delivery is ready at port ${port}, captain!`);
});

const raiseEvent = (orderId) => {
  return new Promise((resolve) => {
    const producerClient = new kafka.KafkaClient();
    const producer = new kafka.Producer(producerClient);

    producer.on("ready", () => {
      const event = {
        id: uuidv4(),
        name: "delivery.coffee-delivered",
        version: 1,
        occurredOn: new Date(),
        message: { orderId }
      };
      const payload = [{
        topic: event.name.split(".")[0],
        messages: [JSON.stringify(event)],
        partition: 0
      }];
      producer.send(payload, (error) => {
        error ?
          console.error(error) :
          console.log("event raised: ", event);
        producer.close();
        producerClient.close((error) => {
          if (error) {
            console.error(error);
          }
        });
        resolve();
      });
    });

    producer.on("error", function(error) {
      console.error(error);
      producer.close();
      producerClient.close((error) => {
        if (error) {
          console.error(error);
        }
      });
    });
  });
};
