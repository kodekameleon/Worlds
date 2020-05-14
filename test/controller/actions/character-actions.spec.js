import {expect} from "chai";
import {ANY, FeatureIds} from "../../../src/constants";
import {Character, Feature} from "../../../src/model";
import {doActivateFeatureChoice, doApplyAbilityScoreModifier, doChangeAbilityScores} from "../../../src/controller/actions";

describe("Character Actions", () => {
  let character;

  describe("Change base ability scores", () => {
    beforeEach(() => {
      character = Character();
      character.features.featureList.push(Feature({}, {
        uniqueId: FeatureIds.STANDARD_ARRAY,
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
      doChangeAbilityScores(character, FeatureIds.STANDARD_ARRAY, {strength: 18, dexterity: 15});

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
      const res = doChangeAbilityScores(character, FeatureIds.STANDARD_ARRAY, {strength: 15, dexterity: 14});

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
      const undo = doChangeAbilityScores(character, FeatureIds.STANDARD_ARRAY, {strength: 18, dexterity: 15});

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
      const undo = doChangeAbilityScores(character, FeatureIds.STANDARD_ARRAY, {strength: 18, dexterity: 15});

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
        uniqueId: FeatureIds.STANDARD_ARRAY,
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
      const res = doApplyAbilityScoreModifier(character, FeatureIds.STANDARD_ARRAY, "strength", +1);

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

  describe("Activate a feature choice", () => {
    beforeEach(() => {
      character = Character();
      character.features.featureList.push(Feature({}, {
        uniqueId: FeatureIds.BASE_ABILITY_SCORES_CHOICES,
        name: "Ability scores options",
        featureChoices: [
          Feature({}, {
            uniqueId: FeatureIds.STANDARD_ARRAY,
            name: "Standard Scores",
            isBaseScore: true,
            strength: 15,
            dexterity: 14,
            constitution: 13,
            intelligence: 12,
            wisdom: 10,
            charisma: 8
          }),
          Feature({}, {
            uniqueId: FeatureIds.POINTS_BUY,
            name: "Points Buy",
            isBaseScore: true,
            strength: 8,
            dexterity: 8,
            constitution: 8,
            intelligence: 8,
            wisdom: 8,
            charisma: 8
          }),
          Feature({}, {
            uniqueId: FeatureIds.RANDOM,
            name: "Dice Roll",
            isBaseScore: true,
            strength: 8,
            dexterity: 8,
            constitution: 8,
            intelligence: 8,
            wisdom: 8,
            charisma: 8
          }),
          Feature({}, {
            uniqueId: FeatureIds.MANUAL,
            name: "Manual Entry",
            isBaseScore: true,
            strength: 8,
            dexterity: 8,
            constitution: 8,
            intelligence: 8,
            wisdom: 8,
            charisma: 8
          })
        ]
      }));
    });

    it("should activate a feature choice", () => {
      const res = doActivateFeatureChoice(character, FeatureIds.BASE_ABILITY_SCORES_CHOICES, FeatureIds.RANDOM);
      expect(res).to.be.truthy;
      expect(character.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES)?.uniqueId).to.equal(FeatureIds.RANDOM);
      expect(character.features.featureList).to.have.length(2);
    });

    it("should activate a feature choice and return a function to undo the change", () => {
      const res = doActivateFeatureChoice(character, FeatureIds.BASE_ABILITY_SCORES_CHOICES, FeatureIds.RANDOM);
      expect(res).to.be.a("function");
      expect(character.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES)?.uniqueId).to.equal(FeatureIds.RANDOM);
      expect(character.features.featureList).to.have.length(2);

      expect(res()).to.be.a("function");
      expect(character.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES)).to.be.undefined;
      expect(character.features.featureList).to.have.length(1);
    });

    it("should activate a feature choice and deactivate the feature already active", () => {
      let res = doActivateFeatureChoice(character, FeatureIds.BASE_ABILITY_SCORES_CHOICES, FeatureIds.RANDOM);
      expect(res).to.be.truthy;
      expect(character.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES)?.uniqueId).to.equal(FeatureIds.RANDOM);
      expect(character.features.featureList).to.have.length(2);

      res = doActivateFeatureChoice(character, FeatureIds.BASE_ABILITY_SCORES_CHOICES, FeatureIds.POINTS_BUY);
      expect(res).to.be.truthy;
      expect(character.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES)?.uniqueId).to.equal(FeatureIds.POINTS_BUY);
      expect(character.features.featureList).to.have.length(2);
    });

    it("should activate a feature choice and deactivate the feature already active and return a function to undo the change", () => {
      let res = doActivateFeatureChoice(character, FeatureIds.BASE_ABILITY_SCORES_CHOICES, FeatureIds.RANDOM);
      expect(res).to.be.truthy;
      expect(character.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES)?.uniqueId).to.equal(FeatureIds.RANDOM);
      expect(character.features.featureList).to.have.length(2);

      res = doActivateFeatureChoice(character, FeatureIds.BASE_ABILITY_SCORES_CHOICES, FeatureIds.POINTS_BUY);
      expect(res).to.be.truthy;
      expect(character.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES)?.uniqueId).to.equal(FeatureIds.POINTS_BUY);
      expect(character.features.featureList).to.have.length(2);

      expect(res()).to.be.a("function");
      expect(character.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES)?.uniqueId).to.equal(FeatureIds.RANDOM);
      expect(character.features.featureList).to.have.length(2);
    });

    it("should deactivate a feature choice when no choice is provided", () => {
      let res = doActivateFeatureChoice(character, FeatureIds.BASE_ABILITY_SCORES_CHOICES, FeatureIds.RANDOM);
      expect(res).to.be.truthy;
      expect(character.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES)?.uniqueId).to.equal(FeatureIds.RANDOM);
      expect(character.features.featureList).to.have.length(2);

      res = doActivateFeatureChoice(character, FeatureIds.BASE_ABILITY_SCORES_CHOICES);
      expect(res).to.be.truthy;
      expect(character.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES)).to.be.undefined;
      expect(character.features.featureList).to.have.length(1);
    });

    it("should do nothing when the feature being activated is already active", () => {
      let res = doActivateFeatureChoice(character, FeatureIds.BASE_ABILITY_SCORES_CHOICES, FeatureIds.RANDOM);
      expect(res).to.be.truthy;
      expect(character.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES)?.uniqueId).to.equal(FeatureIds.RANDOM);
      expect(character.features.featureList).to.have.length(2);

      res = doActivateFeatureChoice(character, FeatureIds.BASE_ABILITY_SCORES_CHOICES, FeatureIds.RANDOM);
      expect(res).to.be.falsy;
      expect(character.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES)?.uniqueId).to.equal(FeatureIds.RANDOM);
      expect(character.features.featureList).to.have.length(2);
    });

    it("should do nothing when deactivating a feature and there is no active feature", () => {
      const res = doActivateFeatureChoice(character, FeatureIds.BASE_ABILITY_SCORES_CHOICES);
      expect(res).to.be.falsy;
      expect(character.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES)).to.be.undefined;
      expect(character.features.featureList).to.have.length(1);
    });
  });
});
