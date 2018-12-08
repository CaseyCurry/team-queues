import { expect } from "chai";
import { Lifecycle } from "./lifecycle";
import { v4 as uuidv4 } from "uuid";
import { Item } from "./item";
import { ConfiguredEvent } from "./configured-event";
import { LifecycleVersion } from "../entities/lifecycle-version";
import { ConfiguredEventVersion } from "../value-objects/configured-event-version";
import { ConfiguredEventVersionMap } from "../value-objects/configured-event-version-map";
import { ConditionScope } from "../value-objects/condition-scope";
import { Condition } from "../value-objects/condition";
import { ConditionGroup } from "../value-objects/condition-group";
import { ConditionalDestination } from "../value-objects/conditional-destination";
import { UnconditionalDestination } from "../value-objects/unconditional-destination";
import { ConditionFact } from "../value-objects/condition-fact";
import { TriggeredDestination } from "../value-objects/triggered-destination";
import { DestinationProcessor } from "../services/destination-processor";

describe("lifecycle suite", () => {
  const lifecycleId = uuidv4();
  const lifecycleOf = "coffee";
  const activeLifecycleVersionNumber = 2;

  describe("when lifecycle is created", () => {
    const triggersForItemCreation = [];
    const queues = [];
    const previousVersion = new LifecycleVersion({
      number: activeLifecycleVersionNumber - 1,
      triggersForItemCreation,
      queues
    });
    const activeVersion = new LifecycleVersion({
      number: activeLifecycleVersionNumber,
      triggersForItemCreation,
      queues
    });
    const nextVersion = new LifecycleVersion({
      number: activeLifecycleVersionNumber + 1,
      triggersForItemCreation,
      queues
    });
    let lifecycle;

    beforeEach(() => {
      lifecycle = new Lifecycle({
        id: lifecycleId,
        lifecycleOf,
        previousVersion,
        activeVersion,
        nextVersion
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

    it("should create a lifecycle with an previous version", () => {
      expect(lifecycle.previousVersion)
        .to.deep.equal(previousVersion);
    });

    it("should create a lifecycle with an active version", () => {
      expect(lifecycle.activeVersion)
        .to.deep.equal(activeVersion);
    });

    it("should create a lifecycle with a next version", () => {
      expect(lifecycle.nextVersion)
        .to.deep.equal(nextVersion);
    });

    it("should create a lifecycle with domain events", () => {
      expect(lifecycle.domainEvents)
        .to.exist;
    });
  });

  describe("when event occurs", () => {
    let lifecycle;
    let occurredEvent;
    let configuredEvent;
    let destinationProcessor;

    beforeEach(() => {
      const activeVersion = new LifecycleVersion({
        number: activeLifecycleVersionNumber,
        triggersForItemCreation: [{
          eventNames: ["customer-arrived"],
          destinations: [
            new UnconditionalDestination({
              queueName: "Cashier Queue",
              taskType: "Take Order"
            })
          ]
        }],
        queues: [{
          name: "Cashier Queue",
          taskType: "Take Order"
        }]
      });
      lifecycle = new Lifecycle({
        id: lifecycleId,
        lifecycleOf,
        activeVersion
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
        const createdItem = await lifecycle
          .processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(createdItem)
          .to.exist;
      });

      it("should create an item that includes the customer id", async () => {
        const createdItem = await lifecycle
          .processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(createdItem.foreignId)
          .to.equal(occurredEvent.customer.id);
      });

      it("should create an item that includes the lifecycle id", async () => {
        const createdItem = await lifecycle
          .processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(createdItem.lifecycleId)
          .to.equal(lifecycle.id);
      });

      it("should raise a single event on the lifecycle", async () => {
        await lifecycle
          .processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(lifecycle.domainEvents.raisedEvents.length)
          .to.equal(1);
      });

      it("should raise an event for the item creation", async () => {
        await lifecycle
          .processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(lifecycle.domainEvents.raisedEvents[0].name)
          .to.equal("team-queues.item-created");
      });

      it("should raise an event that includes the item", async () => {
        await lifecycle
          .processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(lifecycle.domainEvents.raisedEvents[0].message.item)
          .to.exist;
      });

      it("should raise an event that includes the item that includes the lifecycle id", async () => {
        await lifecycle
          .processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(lifecycle.domainEvents.raisedEvents[0].message.item.lifecycleId)
          .to.equal(lifecycle.id);
      });

      it("should raise an event for the task creation", async () => {
        const createdItem = await lifecycle
          .processEvent(destinationProcessor, occurredEvent, configuredEvent);
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
          Object.assign({}, configuredEvent, { name: "customer-ordered" })
        );
      });

      it("should not create an item", async () => {
        const createdItem = await lifecycle
          .processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(createdItem)
          .to.not.exist;
      });

      it("should not raise an event", async () => {
        await lifecycle
          .processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(lifecycle.domainEvents.raisedEvents.length)
          .to.equal(0);
      });
    });

    describe("when triggering event has two destinations", () => {
      beforeEach(() => {
        const activeVersion = new LifecycleVersion({
          number: activeLifecycleVersionNumber,
          triggersForItemCreation: [{
            eventNames: ["customer-arrived"],
            destinations: [
              new UnconditionalDestination({
                queueName: "Cashier Queue",
                taskType: "Take Order"
              }),
              new UnconditionalDestination({
                queueName: "Barista Queue",
                taskType: "Make Coffee"
              })
            ]
          }],
          queues: [{
            name: "Cashier Queue",
            taskType: "Take Order"
          }, {
            name: "Barista Queue",
            taskType: "Make Coffee"
          }]
        });
        lifecycle = new Lifecycle({
          id: lifecycleId,
          lifecycleOf,
          activeVersion
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
        const createdItem = await lifecycle
          .processEvent(destinationProcessor, occurredEvent, configuredEvent);
        expect(createdItem.tasks.length)
          .to.equal(2);
      });
    });

    describe("when queue destinations are bound to events", () => {
      let itemInLifecycle;
      const targetQueueName = "Barista Queue";
      const targetTaskType = "Make Coffee";

      beforeEach(() => {
        const activeVersion = new LifecycleVersion({
          number: activeLifecycleVersionNumber,
          triggersForItemCreation: [{
            eventNames: ["customer-arrived"],
            destinations: [
              new UnconditionalDestination({
                queueName: "Cashier Queue",
                taskType: "Take Order"
              })
            ]
          }],
          queues: [{
            name: "Cashier Queue",
            taskType: "Take Order",
            destinationsWhenEventOccurred: [
              new TriggeredDestination({
                eventNames: ["customer-ordered"],
                destinations: [
                  new UnconditionalDestination({
                    queueName: targetQueueName,
                    taskType: targetTaskType,
                    doesCompletePreviousTask: true
                  })
                ]
              })
            ]
          }, {
            name: targetQueueName,
            taskType: targetTaskType
          }]
        });
        lifecycle = new Lifecycle({
          id: lifecycleId,
          lifecycleOf,
          activeVersion
        });
        itemInLifecycle = new Item({
          id: 987,
          foreignId: 789,
          lifecycleId: lifecycleId
        });
        itemInLifecycle.createTask({
          queueName: "Cashier Queue",
          taskType: "Take Order"
        });
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
            Object.assign({}, configuredEvent, { name: "customer-ordered" })
          );
        });

        it("should create a task", async () => {
          await lifecycle
            .processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
          expect(itemInLifecycle.tasks.length)
            .to.equal(2);
        });

        it("should create a task that includes the queue name", async () => {
          await lifecycle
            .processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
          // the first task was added arranging this test so we expect one additional task
          expect(itemInLifecycle.tasks[1].queueName)
            .to.equal(targetQueueName);
        });

        it("should create a task that includes the task type", async () => {
          await lifecycle
            .processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
          // the first task was added arranging this test so we expect one additional task
          expect(itemInLifecycle.tasks[1].type)
            .to.equal(targetTaskType);
        });

        it("should raise an event for the created task", async () => {
          await lifecycle
            .processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
          expect(itemInLifecycle.domainEvents.raisedEvents[1].name)
            .to.equal("team-queues.task-created");
        });

        describe("when the destination is configured to complete the previous task", () => {
          it("should complete the previous task", async () => {
            await lifecycle
              .processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
            // the first task was added arranging this test so we expect one additional task
            expect(itemInLifecycle.tasks[0].isComplete)
              .to.equal(true);
          });

          it("should raise a pair of event", async () => {
            await lifecycle
              .processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
            // the first event occurred arranging this test so we expect two additional events
            expect(itemInLifecycle.domainEvents.raisedEvents.length)
              .to.equal(3);
          });

          it("should raise an event for the completed task", async () => {
            await lifecycle
              .processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
            // the first event occurred arranging this test so we expect two additional events
            expect(itemInLifecycle.domainEvents.raisedEvents[2].name)
              .to.equal("team-queues.task-completed");
          });
        });

        describe("when the destination is configured to not complete the previous task", () => {
          beforeEach(() => {
            const activeVersion = new LifecycleVersion({
              number: activeLifecycleVersionNumber,
              triggersForItemCreation: [],
              queues: [{
                name: "Cashier Queue",
                taskType: "Take Order",
                destinationsWhenEventOccurred: [
                  new TriggeredDestination({
                    eventNames: [
                      "customer-ordered"
                    ],
                    destinations: [
                      new UnconditionalDestination({
                        queueName: targetQueueName,
                        taskType: targetTaskType,
                        doesCompletePreviousTask: false
                      })
                    ]
                  })
                ]
              }, {
                name: targetQueueName,
                taskType: targetTaskType
              }]
            });
            lifecycle = new Lifecycle({
              id: lifecycleId,
              lifecycleOf,
              activeVersion
            });
          });

          it("should not complete the existing task", async () => {
            await lifecycle
              .processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
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
            Object.assign({}, configuredEvent, { name: "make-coffee" })
          );
        });

        it("should not create a task ", async () => {
          await lifecycle
            .processEvent(destinationProcessor, occurredEvent, configuredEvent, itemInLifecycle);
          // the first task was added arranging this test so we expect one additional task
          expect(itemInLifecycle.tasks.length)
            .to.equal(1);
        });
      });
    });

    describe("when queue destinations are bound to task creation", () => {
      const targetQueueName1 = "Barista Queue";
      const targetTaskType1 = "Make Coffee";
      const targetQueueName2 = "Barista Queue";
      const targetTaskType2 = "Deliver Coffee";

      beforeEach(() => {
        const activeVersion = new LifecycleVersion({
          number: activeLifecycleVersionNumber,
          triggersForItemCreation: [{
            eventNames: ["customer-arrived"],
            destinations: [
              new UnconditionalDestination({
                queueName: "Cashier Queue",
                taskType: "Take Order"
              })
            ]
          }],
          queues: [{
            name: "Cashier Queue",
            taskType: "Take Order",
            destinationsWhenTaskCreated: [
              new UnconditionalDestination({
                queueName: targetQueueName1,
                taskType: targetTaskType1,
                doesCompletePreviousTask: false
              })
            ]
          }, {
            name: targetQueueName1,
            taskType: targetTaskType1,
            destinationsWhenTaskCreated: [
              new UnconditionalDestination({
                queueName: targetQueueName2,
                taskType: targetTaskType2,
                doesCompletePreviousTask: false
              })
            ]
          }, {
            name: targetQueueName2,
            taskType: targetTaskType2
          }]
        });
        lifecycle = new Lifecycle({
          id: lifecycleId,
          lifecycleOf,
          activeVersion
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
          const createdItem = await lifecycle
            .processEvent(destinationProcessor, occurredEvent, configuredEvent);
          expect(createdItem.tasks.length)
            .to.equal(3);
        });

        it("should create a task with the first queue name", async () => {
          const createdItem = await lifecycle
            .processEvent(destinationProcessor, occurredEvent, configuredEvent);
          const task = createdItem.tasks.find((task) => task.id === 1);
          expect(task.queueName)
            .to.equal("Cashier Queue");
        });

        it("should create a task with the first task type", async () => {
          const createdItem = await lifecycle
            .processEvent(destinationProcessor, occurredEvent, configuredEvent);
          const task = createdItem.tasks.find((task) => task.id === 1);
          expect(task.type)
            .to.equal("Take Order");
        });

        it("should create a task with the second queue name", async () => {
          const createdItem = await lifecycle
            .processEvent(destinationProcessor, occurredEvent, configuredEvent);
          const task = createdItem.tasks.find((task) => task.id === 2);
          expect(task.queueName)
            .to.equal(targetQueueName1);
        });

        it("should create a task with the second task type", async () => {
          const createdItem = await lifecycle
            .processEvent(destinationProcessor, occurredEvent, configuredEvent);
          const task = createdItem.tasks.find((task) => task.id === 2);
          expect(task.type)
            .to.equal(targetTaskType1);
        });

        it("should create a task with the third queue name", async () => {
          const createdItem = await lifecycle
            .processEvent(destinationProcessor, occurredEvent, configuredEvent);
          const task = createdItem.tasks.find((task) => task.id === 3);
          expect(task.queueName)
            .to.equal(targetQueueName2);
        });

        it("should create a task with the third task type", async () => {
          const createdItem = await lifecycle
            .processEvent(destinationProcessor, occurredEvent, configuredEvent);
          const task = createdItem.tasks.find((task) => task.id === 3);
          expect(task.type)
            .to.equal(targetTaskType2);
        });

        it("should raise another event for the new task", async () => {
          const createdItem = await lifecycle
            .processEvent(destinationProcessor, occurredEvent, configuredEvent);
          expect(createdItem.domainEvents.raisedEvents.length)
            .to.equal(3);
        });
      });
    });

    describe("when queue destinations are bound to task completion", () => {
      const targetQueueName1 = "Barista Queue";
      const targetTaskType1 = "Make Coffee";
      const targetQueueName2 = "Barista Queue";
      const targetTaskType2 = "Deliver Coffee";

      beforeEach(() => {
        const activeVersion = new LifecycleVersion({
          number: activeLifecycleVersionNumber,
          triggersForItemCreation: [{
            eventNames: ["customer-arrived"],
            destinations: [
              new UnconditionalDestination({
                queueName: "Cashier Queue",
                taskType: "Take Order"
              })
            ]
          }],
          queues: [{
            name: "Cashier Queue",
            taskType: "Take Order",
            destinationsWhenTaskCreated: [
              new UnconditionalDestination({
                queueName: targetQueueName1,
                taskType: targetTaskType1,
                doesCompletePreviousTask: true
              })
            ],
            destinationsWhenTaskCompleted: [
              new UnconditionalDestination({
                queueName: targetQueueName2,
                taskType: targetTaskType2,
                doesCompletePreviousTask: false
              })
            ]
          }, {
            name: targetQueueName1,
            taskType: targetTaskType1
          }, {
            name: targetQueueName2,
            taskType: targetTaskType2
          }]
        });
        lifecycle = new Lifecycle({
          id: lifecycleId,
          lifecycleOf,
          activeVersion
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
          const createdItem = await lifecycle
            .processEvent(destinationProcessor, occurredEvent, configuredEvent);
          expect(createdItem.tasks.length)
            .to.equal(3);
        });
      });
    });

    describe("when trigger includes a conditional destination", () => {
      const targetQueueNameWhenConditionIsMet = "Barista Queue";
      const targetTaskTypeWhenConditionIsMet = "Make Coffee";
      const targetQueueNameWhenConditionIsNotMet = "Barista Queue";
      const targetTaskTypeWhenConditionIsNotMet = "Deliver Coffee";
      let destinationsWhenConditionIsMet;
      let destinationsWhenConditionIsNotMet;
      let conditionalDestination;
      let item;
      let customerOrderedConfiguredEvent;

      beforeEach(async () => {
        destinationsWhenConditionIsMet = [
          new UnconditionalDestination({
            queueName: targetQueueNameWhenConditionIsMet,
            taskType: targetTaskTypeWhenConditionIsMet,
            doesCompletePreviousTask: true
          })
        ];
        destinationsWhenConditionIsNotMet = [
          new UnconditionalDestination({
            queueName: targetQueueNameWhenConditionIsNotMet,
            taskType: targetTaskTypeWhenConditionIsNotMet,
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
        const activeVersion = new LifecycleVersion({
          number: activeLifecycleVersionNumber,
          triggersForItemCreation: [{
            eventNames: ["customer-arrived"],
            destinations: [
              new UnconditionalDestination({
                queueName: "Cashier Queue",
                taskType: "Take Order"
              })
            ]
          }],
          queues: [{
            name: "Cashier Queue",
            taskType: "Take Order",
            destinationsWhenEventOccurred: [
              new TriggeredDestination({
                eventNames: ["customer-ordered"],
                destinations: [conditionalDestination]
              })
            ]
          }, {
            name: targetQueueNameWhenConditionIsMet,
            taskType: targetTaskTypeWhenConditionIsMet
          }, {
            name: targetQueueNameWhenConditionIsNotMet,
            taskType: targetTaskTypeWhenConditionIsNotMet
          }]
        });
        lifecycle = new Lifecycle({
          id: lifecycleId,
          lifecycleOf,
          activeVersion
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
        item = await lifecycle
          .processEvent(destinationProcessor, occurredEvent, configuredEvent);
        customerOrderedConfiguredEvent = new ConfiguredEvent(
          Object.assign({}, configuredEvent, { name: "customer-ordered" })
        );
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
                resolve(
                  destinationsWhenConditionIsNotMet
                );
              });
            }
          });
          await lifecycle
            .processEvent(destinationProcessor, customerOrderedOccurredEvent, customerOrderedConfiguredEvent, item);
        });

        it("should create task in the queue name bound to when the condition is not met", () => {
          expect(item.tasks[1].queueName)
            .to.equal(targetQueueNameWhenConditionIsNotMet);
        });

        it("should create task of the type bound to when the condition is not met", () => {
          expect(item.tasks[1].type)
            .to.equal(targetTaskTypeWhenConditionIsNotMet);
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
        it("should create task in the queue name bound to when the condition is met", async () => {
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
                resolve(
                  destinationsWhenConditionIsMet
                );
              });
            }
          });
          await lifecycle
            .processEvent(destinationProcessor, customerOrderedOccurredEvent, customerOrderedConfiguredEvent, item);
          expect(item.tasks[1].queueName)
            .to.equal(targetQueueNameWhenConditionIsMet);
        });

        it("should create task of the type bound to when the condition is met", async () => {
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
                resolve(
                  destinationsWhenConditionIsMet
                );
              });
            }
          });
          await lifecycle
            .processEvent(destinationProcessor, customerOrderedOccurredEvent, customerOrderedConfiguredEvent, item);
          expect(item.tasks[1].type)
            .to.equal(targetTaskTypeWhenConditionIsMet);
        });
      });
    });
  });
});
