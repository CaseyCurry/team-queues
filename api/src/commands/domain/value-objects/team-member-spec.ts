import { expect } from "chai";
import { TeamMember } from "./team-member";

describe("team member suite", () => {
  describe("when a team member is created", () => {
    let teamMember: TeamMember;
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
});
