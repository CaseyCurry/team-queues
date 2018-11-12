import { expect } from "chai";
import { Lifecycle } from "./lifecycle";
import { Item } from "./item";
import { ConfiguredEvent } from "./configured-event";
import { ConfiguredEventVersion } from "../value-objects/configured-event-version";
import { ConfiguredEventVersionMap } from "../value-objects/configured-event-version-map";
import { ConditionScope } from "../value-objects/condition-scope";
import { Condition } from "../value-objects/condition";
import { ConditionGroup } from "../value-objects/condition-group";
import { ConditionalDestination } from "../value-objects/conditional-destination";
import { UnconditionalDestination } from "../value-objects/unconditional-destination";
import { ConditionFact } from "../value-objects/condition-fact";
import { Trigger } from "../value-objects/trigger";
import { DestinationProcessor } from "../services/destination-processor";

describe("lifecycle suite", () => {
  const lifecycleId = 456;
  const lifecycleOf = "coffee";
  const lifecycleVersion = 1;

  describe("when lifecycle is created", () => {
    let triggersForItemCreation = [];
    let queues = [];
    let lifecycle;

    beforeEach(() => {
      lifecycle = new Lifecycle({
        id: lifecycleId,
        lifecycleOf,
        version: lifecycleVersion,
        triggersForItemCreation,
        queues
      });
    });

    it("should create a lifecycle with the id", () => {
      expect(lifecycle.id)
        .to.equal(lifecycleId);
    });

    it("should create a lifecycle with the type of object it processes", () => {
      expect(lifecycle.lifecycleOf)
        .to.equal(lifecycleOf);
    });

    it("should create a lifecycle with the version", () => {
      expect(lifecycle.version)
        .to.equal(lifecycleVersion);
    });

    it("should create a lifecycle with the triggers for item creation", () => {
      expect(lifecycle.triggersForItemCreation)
        .to.deep.equal(triggersForItemCreation);
    });

    it("should create a lifecycle with the queues", () => {
      expect(lifecycle.queues)
        .to.equal(queues);
    });

    it("should create a lifecycle with domain events", () => {
      expect(lifecycle.domainEvents)
        .to.not.be.null;
    });
  });

  describe("when event occurs", () => {
    let lifecycle;
    let occurredEvent;
    let configuredEvent;
    let destinationProcessor;

    beforeEach(() => {
      lifecycle = new Lifecycle({
        id: lifecycleId,
        lifecycleOf,
        version: lifecycleVersion
      });
      lifecycle.createQueue({
        id: "3a038cfe-93a9-4724-991a-0939c798bb3c",
        name: "Cashier Queue",
        taskType: "Take Order"
      });
      lifecycle.createTriggerForItemCreation({
        eventNames: ["customer-arrived"],
        destinations: [
          new UnconditionalDestination({
            queueId: "3a038cfe-93a9-4724-991a-0939c798bb3c"
          })
        ]
      });
      destinationProcessor = new DestinationProcessor();
      configuredEvent = new ConfiguredEvent({
        name: "customer-arrived",
        versions: [
          new ConfiguredEventVersion({
            number: 1,
            maps: [
              new ConfiguredEventVersionMap({
                source: "customer.id",
                target: "foreignId"
              })
            ]
          })
        ]
      });
    });

    describe("when item does not exist for the triggering event", () => {
      beforeEach(() => {
        occurredEvent = {
          id: 123,
          name: "customer-arrived",
          version: 1,
          occurredOn: new Date(2018, 10, 25, 6),
          customer: {
            id: 789,
            isNextOrderFree: false
          }
        };
      });

      it("should create an item", async () => {
        const createdItem = await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(createdItem)
          .to.exist;
      });

      it("should create an item that includes the customer id", async () => {
        const createdItem = await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(createdItem.foreignId)
          .to.equal(occurredEvent.customer.id);
      });

      it("should create an item that includes the lifecycle id", async () => {
        const createdItem = await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(createdItem.lifecycleId)
          .to.equal(lifecycle.id);
      });

      it("should raise a single event on the lifecycle", async () => {
        await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(lifecycle.domainEvents.raisedEvents.length)
          .to.equal(1);
      });

      it("should raise an event for the item creation", async () => {
        await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(lifecycle.domainEvents.raisedEvents[0].name)
          .to.equal("team-queues.item-created");
      });

      it("should raise an event that includes the item", async () => {
        await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(lifecycle.domainEvents.raisedEvents[0].message.item)
          .to.exist;
      });

      it("should raise an event that includes the item that includes the lifecycle id", async () => {
        await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(lifecycle.domainEvents.raisedEvents[0].message.item.lifecycleId)
          .to.equal(lifecycle.id);
      });

      it("should raise an event for the task creation", async () => {
        const createdItem = await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(createdItem.domainEvents.raisedEvents[0].name)
          .to.equal("team-queues.task-created");
      });
    });

    describe("when event does not trigger item creation", () => {
      beforeEach(() => {
        occurredEvent = {
          id: 123,
          name: "customer-ordered",
          version: 1,
          occurredOn: new Date(2018, 10, 25, 6),
          customer: {
            id: 789,
            isNextOrderFree: false
          }
        };
        configuredEvent = new ConfiguredEvent(
          Object.assign({}, configuredEvent, { name: "customer-ordered" }));
      });

      it("should not create an item", async () => {
        const createdItem = await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(createdItem)
          .to.not.be.ok;
      });

      it("should not raise an event", async () => {
        await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(lifecycle.domainEvents.raisedEvents.length)
          .to.equal(0);
      });
    });

    describe("when triggering event has two destinations", () => {
      beforeEach(() => {
        lifecycle = new Lifecycle({
          id: lifecycleId,
          lifecycleOf,
          version: lifecycleVersion
        });
        lifecycle.createTriggerForItemCreation({
          eventNames: ["customer-arrived"],
          destinations: [
            new UnconditionalDestination({
              queueId: "da8057b4-8f03-4e04-aa62-867ccf4364f7"
            }),
            new UnconditionalDestination({
              queueId: "3a038cfe-93a9-4724-991a-0939c798bb3c"
            })
          ]
        });
        lifecycle.createQueue({
          id: "da8057b4-8f03-4e04-aa62-867ccf4364f7",
          name: "Cashier Queue",
          taskType: "Take Order"
        });
        lifecycle.createQueue({
          id: "3a038cfe-93a9-4724-991a-0939c798bb3c",
          name: "Barista Queue",
          taskType: "Make Coffee"
        });
        occurredEvent = {
          id: 123,
          name: "customer-arrived",
          version: 1,
          occurredOn: new Date(2018, 10, 25, 6),
          customer: {
            id: 789,
            isNextOrderFree: false
          }
        };
      });

      it("should create an item with two destinations", async () => {
        const createdItem = await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(createdItem.tasks.length)
          .to.equal(2);
      });
    });

    describe("when queue destinations are bound to events", () => {
      let itemInLifecycle;
      const targetQueue = "3a038cfe-93a9-4724-991a-0939c798bb3c";

      beforeEach(() => {
        lifecycle = new Lifecycle({
          id: lifecycleId,
          lifecycleOf,
          version: lifecycleVersion
        });
        lifecycle.createTriggerForItemCreation({
          eventNames: ["customer-arrived"],
          destinations: [
            new UnconditionalDestination({
              queueId: "da8057b4-8f03-4e04-aa62-867ccf4364f7"
            })
          ]
        });
        lifecycle.createQueue({
          id: "da8057b4-8f03-4e04-aa62-867ccf4364f7",
          name: "Cashier Queue",
          taskType: "Take Order",
          destinationsWhenEventOccurred: [
            new Trigger({
              eventNames: ["customer-ordered"],
              destinations: [
                new UnconditionalDestination({
                  queueId: targetQueue,
                  doesCompletePreviousTask: true
                })
              ]
            })
          ]
        });
        lifecycle.createQueue({
          id: targetQueue,
          name: "Barista Queue",
          taskType: "Make Coffee"
        });
        itemInLifecycle = new Item({
          id: 987,
          foreignId: 789,
          lifecycleId: lifecycleId
        });
        itemInLifecycle.createTask({ queueId: "da8057b4-8f03-4e04-aa62-867ccf4364f7" });
      });

      describe("when existing item has a task in a queue listening for occurred event", () => {
        beforeEach(() => {
          occurredEvent = {
            id: 123,
            name: "customer-ordered",
            version: 1,
            occurredOn: new Date(2018, 10, 25, 6),
            customer: {
              id: 789,
              isNextOrderFree: false
            }
          };
          configuredEvent = new ConfiguredEvent(
            Object.assign({}, configuredEvent, { name: "customer-ordered" }));
        });

        it("should create a task", async () => {
          await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
          expect(itemInLifecycle.tasks.length)
            .to.equal(2);
        });

        it("should create a task that includes the queue id", async () => {
          await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
          // the first task was added arranging this test so we expect one additional task
          expect(itemInLifecycle.tasks[1].queueId)
            .to.equal(targetQueue);
        });

        it("should raise an event for the created task", async () => {
          await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
          expect(itemInLifecycle.domainEvents.raisedEvents[1].name)
            .to.equal("team-queues.task-created");
        });

        describe("when the destination is configured to complete the previous task", () => {
          it("should complete the previous task", async () => {
            await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
            // the first task was added arranging this test so we expect one additional task
            expect(itemInLifecycle.tasks[0].isComplete)
              .to.equal(true);
          });

          it("should raise a pair of event", async () => {
            await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
            // the first event occurred arranging this test so we expect two additional events
            expect(itemInLifecycle.domainEvents.raisedEvents.length)
              .to.equal(3);
          });

          it("should raise an event for the completed task", async () => {
            await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
            expect(itemInLifecycle.domainEvents.raisedEvents[2].name)
              .to.equal("team-queues.task-completed");
          });
        });

        describe("when the destination is configured to not complete the previous task", () => {
          beforeEach(() => {
            lifecycle = new Lifecycle({
              id: lifecycleId,
              lifecycleOf,
              version: lifecycleVersion
            });
            lifecycle.createQueue({
              id: "da8057b4-8f03-4e04-aa62-867ccf4364f7",
              name: "Cashier Queue",
              taskType: "Take Order",
              destinationsWhenEventOccurred: [
                new Trigger({
                  eventNames: ["customer-ordered"],
                  destinations: [
                    new UnconditionalDestination({
                      queueId: targetQueue,
                      doesCompletePreviousTask: false
                    })
                  ]
                })
              ]
            });
            lifecycle.createQueue({
              id: targetQueue,
              name: "Barista Queue",
              taskType: "Make Coffee"
            });
          });

          it("should not complete the existing task", async () => {
            await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
            // the first task was added arranging this test so we expect one additional task
            expect(itemInLifecycle.tasks[0].isComplete)
              .to.equal(false);
          });
        });
      });

      describe("when existing item has a task in a queue that is not listening for occurred event", () => {
        beforeEach(() => {
          occurredEvent = {
            id: 123,
            name: "make-coffee",
            version: 1,
            occurredOn: new Date(2018, 10, 25, 6),
            customer: {
              id: 789,
              isNextOrderFree: false
            }
          };
          configuredEvent = new ConfiguredEvent(
            Object.assign({}, configuredEvent, { name: "make-coffee" }));
        });

        it("should not create a task ", async () => {
          await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
          // the first task was added arranging this test so we expect one additional task
          expect(itemInLifecycle.tasks.length)
            .to.equal(1);
        });
      });
    });

    describe("when queue destinations are bound to task creation", () => {
      const targetQueue1 = "3a038cfe-93a9-4724-991a-0939c798bb3c";
      const targetQueue2 = "2008e36b-2ce2-4f1c-9c28-c84856ec1854";

      beforeEach(() => {
        lifecycle = new Lifecycle({
          id: lifecycleId,
          lifecycleOf,
          version: lifecycleVersion
        });
        lifecycle.createTriggerForItemCreation({
          eventNames: ["customer-arrived"],
          destinations: [
            new UnconditionalDestination({
              queueId: "da8057b4-8f03-4e04-aa62-867ccf4364f7"
            })
          ]
        });
        lifecycle.createQueue({
          id: "da8057b4-8f03-4e04-aa62-867ccf4364f7",
          name: "Cashier Queue",
          taskType: "Take Order",
          destinationsWhenTaskCreated: [
            new UnconditionalDestination({
              queueId: targetQueue1,
              doesCompletePreviousTask: false
            })
          ]
        });
        lifecycle.createQueue({
          id: targetQueue1,
          name: "Barista Queue",
          taskType: "Make Coffee",
          destinationsWhenTaskCreated: [
            new UnconditionalDestination({
              queueId: targetQueue2,
              doesCompletePreviousTask: false
            })
          ]
        });
        lifecycle.createQueue({
          id: targetQueue2,
          name: "Barista Queue",
          taskType: "Deliver Coffee"
        });
        occurredEvent = {
          id: 123,
          name: "customer-arrived",
          version: 1,
          occurredOn: new Date(2018, 10, 25, 6),
          customer: {
            id: 789,
            isNextOrderFree: false
          }
        };
      });

      describe("when a task is created", () => {
        it("should create another new task", async () => {
          const createdItem = await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
          expect(createdItem.tasks.length)
            .to.equal(3);
        });

        it("should create a task in the first queue", async () => {
          const createdItem = await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
          expect(createdItem.tasks[0].queueId)
            .to.equal("da8057b4-8f03-4e04-aa62-867ccf4364f7");
        });

        it("should create a task in the second queue", async () => {
          const createdItem = await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
          expect(createdItem.tasks[1].queueId)
            .to.equal(targetQueue1);
        });

        it("should create a task in the third queue", async () => {
          const createdItem = await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
          expect(createdItem.tasks[2].queueId)
            .to.equal(targetQueue2);
        });

        it("should raise another event for the new task", async () => {
          const createdItem = await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
          expect(createdItem.domainEvents.raisedEvents.length)
            .to.equal(3);
        });
      });
    });

    describe("when queue destinations are bound to task completion", () => {
      const targetQueue1 = "3a038cfe-93a9-4724-991a-0939c798bb3c";
      const targetQueue2 = "2008e36b-2ce2-4f1c-9c28-c84856ec1854";

      beforeEach(() => {
        lifecycle = new Lifecycle({
          id: lifecycleId,
          lifecycleOf,
          version: lifecycleVersion
        });
        lifecycle.createTriggerForItemCreation({
          eventNames: ["customer-arrived"],
          destinations: [
            new UnconditionalDestination({
              queueId: "da8057b4-8f03-4e04-aa62-867ccf4364f7"
            })
          ]
        });
        lifecycle.createQueue({
          id: "da8057b4-8f03-4e04-aa62-867ccf4364f7",
          name: "Cashier Queue",
          taskType: "Take Order",
          destinationsWhenTaskCreated: [
            new UnconditionalDestination({
              queueId: targetQueue1,
              doesCompletePreviousTask: true
            })
          ],
          destinationsWhenTaskCompleted: [
            new UnconditionalDestination({
              queueId: targetQueue2,
              doesCompletePreviousTask: false
            })
          ]
        });
        lifecycle.createQueue({
          id: targetQueue1,
          name: "Barista Queue",
          taskType: "Make Coffee"
        });
        lifecycle.createQueue({
          id: targetQueue2,
          name: "Cashier Queue",
          taskType: "Direct Customer To Barista"
        });
        occurredEvent = {
          id: 123,
          name: "customer-arrived",
          version: 1,
          occurredOn: new Date(2018, 10, 25, 6),
          customer: {
            id: 789,
            isNextOrderFree: false
          }
        };
      });

      describe("when a task is completed", () => {
        it("should create another task", async () => {
          const createdItem = await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
          expect(createdItem.tasks.length)
            .to.equal(3);
        });
      });
    });

    describe("when trigger includes a conditional destination", () => {
      const targetQueueWhenConditionIsMet = "3a038cfe-93a9-4724-991a-0939c798bb3c";
      const targetQueueWhenConditionIsNotMet = "2008e36b-2ce2-4f1c-9c28-c84856ec1854";
      let destinationsWhenConditionIsMet;
      let destinationsWhenConditionIsNotMet;
      let conditionalDestination;
      let item;
      let customerOrderedConfiguredEvent;

      beforeEach(async () => {
        destinationsWhenConditionIsMet = [
          new UnconditionalDestination({
            queueId: targetQueueWhenConditionIsMet,
            doesCompletePreviousTask: true
          })
        ];
        destinationsWhenConditionIsNotMet = [
          new UnconditionalDestination({
            queueId: targetQueueWhenConditionIsNotMet,
            doesCompletePreviousTask: true
          })
        ];
        conditionalDestination = new ConditionalDestination({
          group: new ConditionGroup({
            scope: ConditionScope.All,
            conditions: [
              new Condition({
                fact: "@event",
                path: ".coffee.isHot",
                operator: "equal",
                value: true
              })
            ]
          }),
          onTrue: destinationsWhenConditionIsMet,
          onFalse: destinationsWhenConditionIsNotMet
        });
        lifecycle = new Lifecycle({
          id: lifecycleId,
          lifecycleOf,
          version: lifecycleVersion
        });
        lifecycle.createTriggerForItemCreation({
          eventNames: ["customer-arrived"],
          destinations: [
            new UnconditionalDestination({
              queueId: "da8057b4-8f03-4e04-aa62-867ccf4364f7"
            })
          ]
        });
        lifecycle.createQueue({
          id: "da8057b4-8f03-4e04-aa62-867ccf4364f7",
          name: "Cashier Queue",
          taskType: "Take Order",
          destinationsWhenEventOccurred: [
            new Trigger({
              eventNames: ["customer-ordered"],
              destinations: [conditionalDestination]
            })
          ]
        });
        lifecycle.createQueue({
          id: targetQueueWhenConditionIsMet,
          name: "Barista Queue",
          taskType: "Make Hot Coffee"
        });
        lifecycle.createQueue({
          id: targetQueueWhenConditionIsNotMet,
          name: "Barista Queue",
          taskType: "Make Cold Coffee"
        });
        occurredEvent = {
          id: 123,
          name: "customer-arrived",
          version: 1,
          occurredOn: new Date(2018, 10, 25, 6),
          customer: {
            id: 789,
            isNextOrderFree: false
          }
        };
        item = await lifecycle.processEvent(destinationProcessor, occurredEvent, configuredEvent);
        customerOrderedConfiguredEvent = new ConfiguredEvent(
          Object.assign({}, configuredEvent, { name: "customer-ordered" }));
      });

      describe("when condition is not met", () => {
        let factArgument;
        let destinationArgument;

        beforeEach(async () => {
          const customerOrderedOccurredEvent = {
            id: 456,
            name: "customer-ordered",
            version: 1,
            occurredOn: new Date(2018, 10, 25, 6),
            customer: {
              id: 789
            },
            coffee: {
              isHot: false
            }
          };
          destinationProcessor = new DestinationProcessor({
            getNextDestinations: (destination, fact) => {
              destinationArgument = destination;
              factArgument = fact;
              return new Promise((resolve) => {
                resolve(destinationsWhenConditionIsNotMet);
              });
            }
          });
          await lifecycle.processEvent(destinationProcessor, customerOrderedOccurredEvent, customerOrderedConfiguredEvent, item);
        });

        it("should create task in the queue bound to when the condition is not met", () => {
          expect(item.tasks[1].queueId)
            .to.equal(targetQueueWhenConditionIsNotMet);
        });

        it("should pass the destination to the rules engine", () => {
          expect(destinationArgument)
            .to.deep.equal(conditionalDestination);
        });

        it("should pass a fact to the rules engine", () => {
          expect(factArgument instanceof ConditionFact)
            .to.equal(true);
        });
      });

      describe("when condition is met", () => {
        it("should create task in the queue bound to when the condition is met", async () => {
          const customerOrderedOccurredEvent = {
            id: 456,
            name: "customer-ordered",
            version: 1,
            occurredOn: new Date(2018, 10, 25, 6),
            customer: {
              id: 789
            },
            coffee: {
              isHot: true
            }
          };
          destinationProcessor = new DestinationProcessor({
            getNextDestinations: () => {
              return new Promise((resolve) => {
                resolve(destinationsWhenConditionIsMet);
              });
            }
          });
          await lifecycle.processEvent(destinationProcessor, customerOrderedOccurredEvent, customerOrderedConfiguredEvent, item);
          expect(item.tasks[1].queueId)
            .to.equal(targetQueueWhenConditionIsMet);
        });
      });
    });
  });
});