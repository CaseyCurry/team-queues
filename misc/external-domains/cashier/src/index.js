import express from "express";
import helmet from "helmet";
import kafka from "kafka-node";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(helmet());
app.use(express.json());

// add a route for health checking the api
app.get("/", (request, response) => {
  response.end();
});

app.post("/orders/hot", async (request, response) => {
  const order = {
    id: uuidv4(),
    coffee: {
      isHot: true,
      isFree: false
    }
  };
  await raiseEvent(order);
  response.status(201)
    .send(order.id);
});

app.post("/orders/cold", async (request, response) => {
  const order = {
    id: uuidv4(),
    coffee: {
      isHot: false,
      isFree: false
    }
  };
  await raiseEvent(order);
  response.status(201)
    .send(order.id);
});

app.post("/orders/free", async (request, response) => {
  const order = {
    id: uuidv4(),
    coffee: {
      isHot: true,
      isFree: true
    }
  };
  await raiseEvent(order);
  response.status(201)
    .send(order.id);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`cashier is ready at port ${port}, captain!`);
});

const raiseEvent = (order) => {
  return new Promise((resolve) => {
    const producerClient = new kafka.KafkaClient();
    const producer = new kafka.Producer(producerClient);

    producer.on("ready", () => {
      const event = {
        id: uuidv4(),
        name: "cashier.coffee-ordered",
        version: 1,
        occurredOn: new Date(),
        message: order
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
