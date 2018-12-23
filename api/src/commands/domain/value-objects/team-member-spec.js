import { expect } from "chai";
import { TeamMember } from "./team-member";

describe("team member suite", () => {
  describe("when a team member is created", () => {
    let teamMember;
    const name = "Jane";

    beforeEach(() => {
      teamMember = new TeamMember({ name });
    });

    it("should include the name", () => {
      expect(teamMember.name).to.equal(name);
    });

    it("should be immutable", () => {
      expect(Object.isFrozen(teamMember)).to.equal(true);
    });
  });

  describe("when an attempt is made to create a team member with invalid arguments", () => {
    it("should throw an error if the name is null", () => {
      const name = null;
      try {
        new TeamMember({ name });
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
});
