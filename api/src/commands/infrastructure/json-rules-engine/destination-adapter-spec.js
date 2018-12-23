import { expect } from "chai";
import { DestinationAdapter } from "./destination-adapter";
import { ConditionalDestination } from "../../domain/value-objects/conditional-destination";
import { ConditionGroup } from "../../domain/value-objects/condition-group";

describe("destination adapter suite", () => {
  describe("when there is a single condition scoped to all", () => {
    let adaptation;
    let destination;

    beforeEach(() => {
      destination = new ConditionalDestination({
        group: new ConditionGroup({
          scope: "All",
          conditions: [
            {
              fact: "coffee",
              path: ".isHot",
              operator: "equal",
              value: true
            }
          ]
        }),
        onTrue: [],
        onFalse: []
      });
      adaptation = DestinationAdapter(destination);
    });

    it("should adapt to all", () => {
      expect(adaptation.conditions).to.deep.equal({
        all: [
          {
            fact: "coffee",
            path: ".isHot",
            operator: "equal",
            value: true
          }
        ]
      });
    });

    it("should include the destinations to use when conditions are met", () => {
      expect(adaptation.onTrue).to.equal(destination.onTrue);
    });

    it("should include the destinations to use when conditions are not met", () => {
      expect(adaptation.onFalse).to.equal(destination.onFalse);
    });
  });

  describe("when there is a single condition scoped to any", () => {
    it("should adapt to any", () => {
      const destination = new ConditionalDestination({
        group: new ConditionGroup({
          scope: "Any",
          conditions: [
            {
              fact: "coffee",
              path: ".isHot",
              operator: "equal",
              value: true
            }
          ]
        }),
        onTrue: [],
        onFalse: []
      });
      const adaptation = DestinationAdapter(destination);
      expect(adaptation.conditions.any).to.exist;
    });
  });

  describe("when there are 2 conditions", () => {
    it("should adapt both conditions", () => {
      const destination = new ConditionalDestination({
        group: new ConditionGroup({
          scope: "All",
          conditions: [
            {
              fact: "coffee",
              path: ".isHot",
              operator: "equal",
              value: true
            },
            {
              fact: "coffee",
              path: ".isFree",
              operator: "equal",
              value: false
            }
          ]
        }),
        onTrue: [],
        onFalse: []
      });
      const adaptation = DestinationAdapter(destination);
      expect(adaptation.conditions).to.deep.equal({
        all: [
          {
            fact: "coffee",
            path: ".isHot",
            operator: "equal",
            value: true
          },
          {
            fact: "coffee",
            path: ".isFree",
            operator: "equal",
            value: false
          }
        ]
      });
    });
  });

  describe("when there are nested conditional destinations", () => {
    it("should adapt the nest", () => {
      const destination = new ConditionalDestination({
        group: new ConditionGroup({
          scope: "All",
          conditions: [
            {
              fact: "coffee",
              path: ".isHot",
              operator: "equal",
              value: true
            },
            new ConditionGroup({
              scope: "Any",
              conditions: [
                {
                  fact: "customer",
                  path: ".isNextCoffeeFree",
                  operator: "equal",
                  value: true
                },
                {
                  fact: "customer",
                  path: ".isGoldMember",
                  operator: "equal",
                  value: true
                }
              ]
            })
          ]
        }),
        onTrue: [],
        onFalse: []
      });
      const adaptation = DestinationAdapter(destination);
      expect(adaptation.conditions).to.deep.equal({
        all: [
          {
            fact: "coffee",
            path: ".isHot",
            operator: "equal",
            value: true
          },
          {
            any: [
              {
                fact: "customer",
                path: ".isNextCoffeeFree",
                operator: "equal",
                value: true
              },
              {
                fact: "customer",
                path: ".isGoldMember",
                operator: "equal",
                value: true
              }
            ]
          }
        ]
      });
    });
  });
});
