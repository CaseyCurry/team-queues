import { expect } from "chai";
import { RulesEngine } from "./rules-engine";
import { ConditionalDestination } from "../../domain/value-objects/conditional-destination";
import { ConditionGroup } from "../../domain/value-objects/condition-group";
import { UnconditionalDestination } from "../../domain/value-objects/unconditional-destination";

describe("rules engine suite", () => {
  let engine;
  let destination;
  const targetQueue1 = "3a038cfe-93a9-4724-991a-0939c798bb3c";
  const targetQueue2 = "2008e36b-2ce2-4f1c-9c28-c84856ec1854";
  const targetQueue3 = "da8057b4-8f03-4e04-aa62-867ccf4364f7";

  beforeEach(() => {
    engine = RulesEngine();
    destination = new ConditionalDestination({
      group: new ConditionGroup({
        scope: "All",
        conditions: [{
          fact: "@coffee",
          path: ".isHot",
          operator: "equal",
          value: true
        }]
      }),
      onTrue: [
        new UnconditionalDestination({
          queueId: targetQueue1
        })
      ],
      onFalse: [
        new ConditionalDestination({
          group: new ConditionGroup({
            scope: "All",
            conditions: [{
              fact: "@coffee",
              path: ".isFree",
              operator: "equal",
              value: true
            }]
          }),
          onTrue: [
            new UnconditionalDestination({
              queueId: targetQueue2
            })
          ],
          onFalse: [
            new UnconditionalDestination({
              queueId: targetQueue3
            })
          ]
        })
      ]
    });
  });

  it("when conditions are met engine should report true", async () => {
    const facts = {
      ["@coffee"]: {
        isHot: true
      }
    };
    const nextDestinations = await engine.getNextDestinations(destination, facts);
    expect(nextDestinations[0].queueId)
      .to.equal(targetQueue1);
  });

  it("when nested conditions are met engine should report true", async () => {
    const facts = {
      ["@coffee"]: {
        isHot: false,
        isFree: true
      }
    };
    const nextDestinations = await engine.getNextDestinations(destination, facts);
    expect(nextDestinations[0].queueId)
      .to.equal(targetQueue2);
  });

  it("when conditions are not met engine should report false", async () => {
    const facts = {
      ["@coffee"]: {
        isHot: false,
        isFree: false
      }
    };
    const nextDestinations = await engine.getNextDestinations(destination, facts);
    expect(nextDestinations[0].queueId)
      .to.equal(targetQueue3);
  });
});