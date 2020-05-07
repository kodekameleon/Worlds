import {ANY} from "../../../src/constants";
import {expect} from "chai";
import {Character, Feature} from "../../../src/model";
import {doApplyAbilityScoreModifier, doChangeAbilityScores} from "../../../src/controller/actions/character-actions";

describe("Character Actions", () => {
  let character;

  describe("Change base ability scores", () => {
    beforeEach(() => {
      character = Character();
      character.features.featureList.push(Feature({}, {
        uniqueId: "base-abilityScores:standard-array",
        name: "Standard Scores",
        isBaseScore: true,
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8
      }));
    });

    it("should make the correct changes", () => {
      doChangeAbilityScores(character, "base-abilityScores:standard-array", {strength: 18, dexterity: 15});

      expect(character.abilityScores).to.deep.equal({
        strength: 18,
        dexterity: 15,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8
      });
    });

    it("should do nothing if nothing has changed", () => {
      const res = doChangeAbilityScores(character, "base-abilityScores:standard-array", {strength: 15, dexterity: 14});

      expect(character.abilityScores).to.deep.equal({
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8
      });

      expect(res).to.be.falsy;
    });

    it("should do nothing if nothing if the feature cannot be found", () => {
      const res = doChangeAbilityScores(character, "xxx", {strength: 15, dexterity: 14});

      expect(character.abilityScores).to.deep.equal({
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8
      });

      expect(res).to.be.falsy;
    });

    it("should return a function to undo the changes", () => {
      const undo = doChangeAbilityScores(character, "base-abilityScores:standard-array", {strength: 18, dexterity: 15});

      expect(character.abilityScores).to.deep.equal({
        strength: 18,
        dexterity: 15,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8
      });

      undo();

      expect(character.abilityScores).to.deep.equal({
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8
      });
    });

    it("should return a function to undo the changes, and that should return a redo function", () => {
      const undo = doChangeAbilityScores(character, "base-abilityScores:standard-array", {strength: 18, dexterity: 15});

      expect(character.abilityScores).to.deep.equal({
        strength: 18,
        dexterity: 15,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8
      });

      const redo = undo();

      expect(character.abilityScores).to.deep.equal({
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8
      });

      redo();

      expect(character.abilityScores).to.deep.equal({
        strength: 18,
        dexterity: 15,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8
      });
    });
  });

  describe("Apply ability score mods", () => {
    beforeEach(() => {
      character = Character();
      character.features.featureList.push(Feature({}, {
        uniqueId: "base-abilityScores:standard-array",
        name: "Standard Scores",
        isBaseScore: true,
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8
      }));
      character.features.featureList.push(Feature({}, {
        uniqueId: "race:half-elf",
        name: "Half Elf",
        charisma: 2,
        chooseUpTo: 2,
        choicesMade: 1,
        maxPerAbility: 1,
        chooseFrom: ["strength", "dexterity", "constitution", "intelligence", "wisdom"],
        chosen: {
          dexterity: 1
        }
      }));
      character.features.featureList.push(Feature({}, {
        uniqueId: "class:wizard-level-4",
        name: "Wizard Level 4",
        chooseUpTo: 2,
        maxPerAbility: 1,
        chooseFrom: ANY
      }));
    });

    it("should make the correct changes to increase ability score", () => {
      doApplyAbilityScoreModifier(character, "race:half-elf", "strength", +1);

      expect(character.abilityScores).to.deep.equal({
        strength: 16,
        dexterity: 15,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 10
      });
    });

    it("should make the correct changes to decrease ability score", () => {
      doApplyAbilityScoreModifier(character, "race:half-elf", "dexterity", -1);

      expect(character.abilityScores).to.deep.equal({
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 10
      });
    });

    it("should do nothing if the feature cannot be found", () => {
      const res = doApplyAbilityScoreModifier(character, "xxx", "strength", +1);

      expect(character.abilityScores).to.deep.equal({
        strength: 15,
        dexterity: 15,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 10
      });

      expect(res).to.be.falsy;
    });

    it("should do nothing if the feature cannot be changed", () => {
      const res = doApplyAbilityScoreModifier(character, "base-abilityScores:standard-array", "strength", +1);

      expect(character.abilityScores).to.deep.equal({
        strength: 15,
        dexterity: 15,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 10
      });

      expect(res).to.be.falsy;
    });

    it("should return a function to undo the changes", () => {
      const undo = doApplyAbilityScoreModifier(character, "race:half-elf", "strength", +1);

      expect(character.abilityScores).to.deep.equal({
        strength: 16,
        dexterity: 15,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 10
      });

      undo();

      expect(character.abilityScores).to.deep.equal({
        strength: 15,
        dexterity: 15,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 10
      });
    });

    it("should return a function to undo the changes, and that should return a redo function", () => {
      const undo = doApplyAbilityScoreModifier(character, "race:half-elf", "strength", +1);

      expect(character.abilityScores).to.deep.equal({
        strength: 16,
        dexterity: 15,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 10
      });

      const redo = undo();

      expect(character.abilityScores).to.deep.equal({
        strength: 15,
        dexterity: 15,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 10
      });

      redo();

      expect(character.abilityScores).to.deep.equal({
        strength: 16,
        dexterity: 15,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 10
      });
    });

    it("should make the increase to the correct feature", () => {
      // Check that the availability is really 1 before we start
      expect(character.getFeature("class:wizard-level-4").getModifier("strength").available).to.equal(1);

      doApplyAbilityScoreModifier(character, "class:wizard-level-4", "strength", +1);

      expect(character.abilityScores).to.deep.equal({
        strength: 16,
        dexterity: 15,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 10
      });

      expect(character.getFeature("class:wizard-level-4").getModifier("strength").available).to.equal(0);
    });

    it("should make the decrease to the correct feature", () => {
      // Check that the availability is really 1 before we start
      expect(character.getFeature("race:half-elf").getModifier("dexterity").available).to.equal(0);

      doApplyAbilityScoreModifier(character, "race:half-elf", "dexterity", -1);

      expect(character.abilityScores).to.deep.equal({
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 10
      });

      expect(character.getFeature("race:half-elf").getModifier("dexterity").available).to.equal(1);
    });
  });
});
