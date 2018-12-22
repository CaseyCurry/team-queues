import { expect } from "chai";
import { LifecycleVersion } from "./lifecycle-version";
import { Queue } from "../value-objects/queue";
import { UnconditionalDestination } from "../value-objects/unconditional-destination";
import { ConditionalDestination } from "../value-objects/conditional-destination";
import { ConditionGroup } from "../value-objects/condition-group";
import { ConditionScope } from "../value-objects/condition-scope";
import { Condition } from "../value-objects/condition";
import { TriggeredDestination } from "../value-objects/triggered-destination";

describe("lifecycle version suite", () => {
  describe("when a version is created", () => {
    let lifecycleVersion;
    const number = 12;
    let triggersForItemCreation = [
      new TriggeredDestination({
        eventNames: ["cashier.order-taken"],
        destinations: [
          new UnconditionalDestination({
            queueName: "Barista Queue",
            taskType: "Make Hot Coffee"
          })
        ]
      })
    ];
    let queues = [
      new Queue({
        name: "Barista Queue",
        taskType: "Make Hot Coffee"
      })
    ];

    beforeEach(() => {
      lifecycleVersion = new LifecycleVersion({
        number,
        triggersForItemCreation,
        queues
      });
    });

    it("should include the version number", () => {
      expect(lifecycleVersion.number)
        .to.equal(number);
    });

    it("should include the triggers for item creation", () => {
      expect(lifecycleVersion.triggersForItemCreation)
        .to.deep.equal(triggersForItemCreation);
    });

    it("should include the queues", () => {
      expect(lifecycleVersion.queues)
        .to.deep.equal(queues);
    });

    describe("when triggers and queues are not passed as arguments", () => {
      beforeEach(() => {
        lifecycleVersion = new LifecycleVersion({ number });
      });

      it("should create an empty array of triggers", () => {
        expect(lifecycleVersion.triggersForItemCreation)
          .to.deep.equal([]);
      });

      it("should create an empty array of queues", () => {
        expect(lifecycleVersion.queues)
          .to.deep.equal([]);
      });
    });

    describe("when a trigger for item creation is added", () => {
      describe("when the queue is configured", () => {
        it("should add the trigger to the lifecycle version", () => {
          lifecycleVersion.addQueue(new Queue({
            name: "Barista Queue",
            taskType: "Make Cold Coffee"
          }));
          const trigger = new TriggeredDestination({
            eventNames: ["cashier.order-taken"],
            destinations: [
              new UnconditionalDestination({
                queueName: "Barista Queue",
                taskType: "Make Cold Coffee"
              })
            ]
          });
          lifecycleVersion.addTriggerForItemCreation(trigger);
          expect(lifecycleVersion.triggersForItemCreation[1])
            .to.deep.equal(trigger);
        });
      });

      describe("when the queue is not configured", () => {
        describe("when the trigger's destination is conditional", () => {
          describe("when the trigger's on true destination is configured", () => {
            it("should not add the trigger to the lifecycle version", () => {
              const trigger = new TriggeredDestination({
                eventNames: ["cashier.order-taken"],
                destinations: [
                  new ConditionalDestination({
                    group: new ConditionGroup({
                      scope: ConditionScope.All,
                      conditions: [
                        new Condition({
                          fact: "coffee",
                          path: ".isHot",
                          operator: "equal",
                          value: true
                        })
                      ]
                    }),
                    onTrue: [
                      new UnconditionalDestination({
                        queueName: "Barista Queue",
                        taskType: "Make Cold Cofee"
                      })
                    ],
                    onFalse: []
                  })
                ]
              });
              try {
                lifecycleVersion.addTriggerForItemCreation(trigger);
              } catch (error) {
                expect(error)
                  .to.exist;
              }
            });
          });

          describe("when the trigger's on false destination is configured", () => {
            it("should not add the trigger to the lifecycle version", () => {
              const trigger = new TriggeredDestination({
                eventNames: ["cashier.order-taken"],
                destinations: [
                  new ConditionalDestination({
                    group: new ConditionGroup({
                      scope: ConditionScope.All,
                      conditions: [
                        new Condition({
                          fact: "coffee",
                          path: ".isHot",
                          operator: "equal",
                          value: true
                        })
                      ]
                    }),
                    onTrue: [],
                    onFalse: [
                      new UnconditionalDestination({
                        queueName: "Barista Queue",
                        taskType: "Make Cold Cofee"
                      })
                    ]
                  })
                ]
              });
              try {
                lifecycleVersion.addTriggerForItemCreation(trigger);
              } catch (error) {
                expect(error)
                  .to.exist;
              }
            });
          });
        });

        describe("when the trigger's destination is unconditional", () => {
          it("should not add the trigger to the lifecycle version", () => {
            const trigger = new TriggeredDestination({
              eventNames: ["cashier.order-taken"],
              destinations: [
                new UnconditionalDestination({
                  queueName: "Barista Queue",
                  taskType: "Make Cold Coffee"
                })
              ]
            });
            try {
              lifecycleVersion.addTriggerForItemCreation(trigger);
            } catch (error) {
              expect(error)
                .to.exist;
            }
          });
        });
      });
    });

    describe("when a queue is added", () => {
      it("should add the queue to the lifecycle version", () => {
        const queue = new Queue({
          name: "Barista Queue",
          taskType: "Make Cold Coffee"
        });
        lifecycleVersion.addQueue(queue);
        expect(lifecycleVersion.queues[1])
          .to.deep.equal(queue);
      });
    });

    describe("when a duplicate queue is added", () => {
      it("should not add the duplicate", () => {
        lifecycleVersion.addQueue(Object.assign({}, queues[0]));
        expect(lifecycleVersion.queues.length)
          .to.equal(1);
      });
    });

    describe("when a version number is not passed as an argument", () => {
      it("should not create a version", () => {
        try {
          new LifecycleVersion({});
        } catch (error) {
          expect(error)
            .to.exist;
        }
      });
    });
  });
});
