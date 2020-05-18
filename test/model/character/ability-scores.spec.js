import {ANY} from "../../../src/constants";
import {expect} from "chai";
import {UniqueObject} from "../../../src/model/unique-object";
import {Abilities, AbilityScoresFeature, AbilityScoresFeatureSet, Character} from "../../../src/model";

const uniqueObject = UniqueObject({}, {name: "Elf", uniqueId: "elf-race-feature"});

describe("Ability Scores Model", () => {
  describe("AbilityScores", () => {
    const character = Character();
    character.features.featureList.push(AbilityScoresFeature({}, {
      isBaseScore: true,
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8
    }));

    it("should get values from the featureList", () => {
      expect(character.strength).to.equal(15);
      expect(character.dexterity).to.equal(14);
      expect(character.constitution).to.equal(13);
      expect(character.intelligence).to.equal(12);
      expect(character.wisdom).to.equal(10);
      expect(character.charisma).to.equal(8);
    });

    it("should calculate bonuses correctly", () => {
      expect(character.bonus.strength).to.equal(2);
      expect(character.bonus.dexterity).to.equal(2);
      expect(character.bonus.constitution).to.equal(1);
      expect(character.bonus.intelligence).to.equal(1);
      expect(character.bonus.wisdom).to.equal(0);
      expect(character.bonus.charisma).to.equal(-1);
    });


    it("should return all of the ability scores correctly in an object", () => {
      expect(character.abilityScores).to.deep.equal({
        strength: character.strength,
        dexterity: character.dexterity,
        constitution: character.constitution,
        intelligence: character.intelligence,
        wisdom: character.wisdom,
        charisma: character.charisma,
      });
    });
  });

  describe("AbilityScoresFeature", () => {
    it("should serialize and deserialize", () => {
      const orig = {
        strength: 6,
        dexterity: 5,
        constitution: 4,
        intelligence: 3,
        wisdom: 2,
        charisma: 1,

        chooseUpTo: 2,
        choicesMade: 0,
        maxPerAbility: 2,
        chooseFrom: ["intelligence", "charisma"],
        chosen: {
          strength: 1,
          dexterity: 2,
          constitution: 3,
          intelligence: 4,
          wisdom: 5,
          charisma: 6
        }
      };

      const feat = AbilityScoresFeature({}, orig);
      const serialized = feat.serialize();

      expect(serialized).to.deep.equalInAnyOrder(orig);
    });

    it("should serialize without undefined values", () => {
      const feat = AbilityScoresFeature({});
      const serialized = feat.serialize();

      expect(serialized).to.deep.equal({});
    });

    it("should report no modifiers available for an empty object", () => {
      const feat = AbilityScoresFeature(uniqueObject);
      expect(feat.strength).to.deep.equal({source: uniqueObject, value: 0, min: 0, max: 0, available: 0});
    });

    it("should return the same when using getters or getAbilityScoreModifiers with a named ability score", () => {
      const feat = AbilityScoresFeature({}, {
        strength: 0,
        dexterity: 1,
        constitution: 2,
        intelligence: 3,
        wisdom: 4,
        charisma: 5
      });

      expect(feat.strength).to.deep.equal(feat.getModifier("strength"));
      expect(feat.dexterity).to.deep.equal(feat.getModifier("dexterity"));
      expect(feat.constitution).to.deep.equal(feat.getModifier("constitution"));
      expect(feat.intelligence).to.deep.equal(feat.getModifier("intelligence"));
      expect(feat.wisdom).to.deep.equal(feat.getModifier("wisdom"));
      expect(feat.charisma).to.deep.equal(feat.getModifier("charisma"));
    });

    it("should recognize an optional modifier is present when it is listed", () => {
      const feature = AbilityScoresFeature({}, {
        chooseFrom: ["strength"]
      });
      expect(feature.hasModifier("strength")).to.be.true;
    });

    it("should recognize an optional modifier is not present when it is not listed", () => {
      const feature = AbilityScoresFeature({}, {
        chooseFrom: ["strength"]
      });
      expect(feature.hasModifier("dexterity")).to.be.false;
    });

    it("should recognize an optional modifier is not present when it is not listed", () => {
      const feature = AbilityScoresFeature({}, {
        chooseFrom: ANY
      });
      expect(feature.hasModifier("dexterity")).to.be.true;
    });

    describe("Detect modifiers", () => {
      const feature = AbilityScoresFeature({}, {
        strength: 0,
        dexterity: 1,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,

        chooseUpTo: 2,
        choicesMade: 0,
        maxPerAbility: 1,
        chooseFrom: ["constitution", "intelligence", "wisdom", "charisma"],
        chosen: {
          strength: 0,
          dexterity: 0,
          constitution: 0,
          intelligence: 0,
          wisdom: 1,
          charisma: 2
        }
      });

      it("should report that an ability score has no modifiers if there are no modifiers", () => {
        expect(feature.hasModifier("strength")).to.equal(false);
      });

      it("should report that an ability score has modifiers if there is a fixed modifier", () => {
        expect(feature.hasModifier("dexterity")).to.equal(true);
      });

      it("should report that an ability score has modifiers if there is an optional modifier", () => {
        expect(feature.hasModifier("constitution")).to.equal(true);
      });
    });

    describe("Fixed modifiers", () => {
      const feature = AbilityScoresFeature(uniqueObject, {
        strength: 0,
        dexterity: 1,
        constitution: 0,
        intelligence: 1,
        wisdom: 0,
        charisma: 1,

        chooseUpTo: 2,
        choicesMade: 0,
        maxPerAbility: 2,
        chooseFrom: ["constitution", "intelligence", "wisdom", "charisma"],
        chosen: {
          strength: 0,
          dexterity: 0,
          constitution: 0,
          intelligence: 0,
          wisdom: 1,
          charisma: 2
        }
      });

      it("should report correct modifier when an ability score is not modified", () => {
        expect(feature.strength.value).to.equal(0);
      });

      it("should report correct modifier when an ability score is modified", () => {
        expect(feature.dexterity.value).to.equal(1);
      });

      it("should report same min/max when not in the optional list", () => {
        expect(feature.strength.min).to.equal(feature.strength.max);
        expect(feature.strength.min).to.equal(0);
      });

      it("should report optional modifiers are allowed when in the optional list", () => {
        expect(feature.constitution.min).to.not.equal(feature.constitution.max);
      });
    });

    describe("Single choice allowed per ability score", () => {
      const feature = AbilityScoresFeature(uniqueObject, {
        strength: 0,
        dexterity: 1,
        constitution: 0,
        intelligence: 1,
        wisdom: 0,
        charisma: 1,

        chooseUpTo: 2,
        choicesMade: 0,
        maxPerAbility: 1,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
        chosen: {
          strength: 0,
          dexterity: 0,
          constitution: 1,
          intelligence: 0,
          wisdom: -1,
          charisma: 2
        }
      });

      const featureUnassigned = AbilityScoresFeature(uniqueObject, {
        chooseUpTo: 2,
        choicesMade: 0,
        maxPerAbility: 1,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"]
      });

      const featureAssigned1 = AbilityScoresFeature(uniqueObject, {
        chooseUpTo: 2,
        choicesMade: 1,
        maxPerAbility: 1,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
        chosen: {
          constitution: 1
        }
      });

      const featureAssigned2 = AbilityScoresFeature(uniqueObject, {
        chooseUpTo: 2,
        choicesMade: 2,
        maxPerAbility: 1,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
        chosen: {
          constitution: 1,
          intelligence: 1
        }
      });

      it("should report correct values when an ability score cannot be modified", () => {
        expect(feature.strength).to.deep.equal({source: uniqueObject, value: 0, min: 0, max: 0, available: 0});
      });

      it("should report correct values when an ability score has not been modified", () => {
        expect(feature.dexterity).to.deep.equal({source: uniqueObject, value: 1, min: 1, max: 2, available: 1});
      });

      it("should report correct values when an ability score has been modified to its limit", () => {
        expect(feature.constitution).to.deep.equal({source: uniqueObject, value: 1, min: 0, max: 1, available: 0});
      });

      it("should report correct values when an ability score has a modifier below the minimum", () => {
        expect(feature.wisdom).to.deep.equal({source: uniqueObject, value: -1, min: 0, max: 1, available: 1});
      });

      it("should report correct values when an ability score has a modifier above the maximum", () => {
        expect(feature.charisma).to.deep.equal({source: uniqueObject, value: 3, min: 1, max: 2, available: 0});
      });

      it("should report correct availability when no option is assigned and ability score cannot be modified", () => {
        expect(featureUnassigned.strength.available).to.equal(0);
      });

      it("should report correct availability when no option is assigned and ability score can be modified", () => {
        expect(featureUnassigned.dexterity.available).to.equal(1);
      });

      it("should report correct availability when one option is assigned and the ability score cannot be modified", () => {
        expect(featureAssigned1.strength.available).to.equal(0);
      });

      it("should report correct availability when one option is assigned and ability score can be modified", () => {
        expect(featureAssigned1.dexterity.available).to.equal(1);
      });

      it("should report correct availability when one option is assigned and ability score has been modified", () => {
        expect(featureAssigned1.constitution.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned and the ability score cannot be modified", () => {
        expect(featureAssigned2.strength.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned and ability score can be modified", () => {
        expect(featureAssigned2.dexterity.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned and ability score has been modified", () => {
        expect(featureAssigned2.constitution.available).to.equal(0);
      });
    });

    describe("Multiple choices allowed per ability score", () => {
      const feature = AbilityScoresFeature(uniqueObject, {
        strength: 0,
        dexterity: 1,
        constitution: 0,
        intelligence: 1,
        wisdom: 0,
        charisma: 1,

        chooseUpTo: 2,
        choicesMade: 0,
        maxPerAbility: 2,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
        chosen: {
          strength: 0,
          dexterity: 0,
          constitution: 1,
          intelligence: 2,
          wisdom: -1,
          charisma: 3
        }
      });

      const featureUnassigned = AbilityScoresFeature(uniqueObject, {
        chooseUpTo: 2,
        choicesMade: 0,
        maxPerAbility: 2,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"]
      });

      const featureAssigned1 = AbilityScoresFeature(uniqueObject, {
        chooseUpTo: 2,
        choicesMade: 1,
        maxPerAbility: 2,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
        chosen: {
          constitution: 1
        }
      });

      const featureAssigned2 = AbilityScoresFeature(uniqueObject, {
        chooseUpTo: 2,
        choicesMade: 2,
        maxPerAbility: 2,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
        chosen: {
          constitution: 1,
          intelligence: 1
        }
      });

      const featureAssigned2OnOne = AbilityScoresFeature(uniqueObject, {
        chooseUpTo: 2,
        choicesMade: 2,
        maxPerAbility: 2,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
        chosen: {
          constitution: 2
        }
      });

      it("should report correct values when an ability score cannot be modified", () => {
        expect(feature.strength).to.deep.equal({source: uniqueObject, value: 0, min: 0, max: 0, available: 0});
      });

      it("should report correct values when an ability score has not been modified", () => {
        expect(feature.dexterity).to.deep.equal({source: uniqueObject, value: 1, min: 1, max: 3, available: 2});
      });

      it("should report correct values when an ability score has been modified", () => {
        expect(feature.constitution).to.deep.equal({source: uniqueObject, value: 1, min: 0, max: 2, available: 1});
      });

      it("should report correct values when an ability score has been modified to its limit", () => {
        expect(feature.intelligence).to.deep.equal({source: uniqueObject, value: 3, min: 1, max: 3, available: 0});
      });

      it("should report correct values when an ability score has a modifier below the minimum", () => {
        expect(feature.wisdom).to.deep.equal({source: uniqueObject, value: -1, min: 0, max: 2, available: 2});
      });

      it("should report correct values when an ability score has a modifier above the maximum", () => {
        expect(feature.charisma).to.deep.equal({source: uniqueObject, value: 4, min: 1, max: 3, available: 0});
      });

      it("should report correct availability when no option is assigned and ability score cannot be modified", () => {
        expect(featureUnassigned.strength.available).to.equal(0);
      });

      it("should report correct availability when no option is assigned and ability score can be modified", () => {
        expect(featureUnassigned.dexterity.available).to.equal(2);
      });

      it("should report correct availability when one option is assigned and the ability score cannot be modified", () => {
        expect(featureAssigned1.strength.available).to.equal(0);
      });

      it("should report correct availability when one option is assigned and ability score can be modified", () => {
        expect(featureAssigned1.dexterity.available).to.equal(1);
      });

      it("should report correct availability when one option is assigned and ability score has been modified", () => {
        expect(featureAssigned1.constitution.available).to.equal(1);
      });

      it("should report correct availability when two options are assigned and the ability score cannot be modified", () => {
        expect(featureAssigned2.strength.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned and ability score can be modified", () => {
        expect(featureAssigned2.dexterity.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned and ability score has been modified", () => {
        expect(featureAssigned2.constitution.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned to one ability score and the ability score cannot be modified", () => {
        expect(featureAssigned2OnOne.strength.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned to one ability score and ability score can be modified", () => {
        expect(featureAssigned2OnOne.dexterity.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned to one ability score and ability score has been modified", () => {
        expect(featureAssigned2OnOne.constitution.available).to.equal(0);
      });
    });

    describe("Partially defined", () => {
      const feature = AbilityScoresFeature({}, {
        intelligence: 1,
        wisdom: 1,
        charisma: 1,
        chooseUpTo: 2,
        maxPerAbility: 1,
        chooseFrom: ["dexterity", "constitution", "wisdom", "charisma"],
        chosen: {
          constitution: 1,
          charisma: 1
        }
      });

      it("should calculate values when no base value is provided and there is no option", () => {
        expect(feature["strength"].value).to.equal(0);
      });

      it("should calculate values when no base value is provided and there is an option, but it is not chosen", () => {
        expect(feature["dexterity"].value).to.equal(0);
      });

      it("should calculate values when no base value is provided and there is an option, and it is chosen", () => {
        expect(feature["constitution"].value).to.equal(1);
      });

      it("should calculate values when a base value is provided and there is no option", () => {
        expect(feature["intelligence"].value).to.equal(1);
      });

      it("should calculate values when a base value is provided and there is an option, but it is not chosen", () => {
        expect(feature["wisdom"].value).to.equal(1);
      });

      it("should calculate values when a base value is provided and there is an option, and it is chosen", () => {
        expect(feature["charisma"].value).to.equal(2);
      });
    });

    describe("Change base ability score", () => {
      const feature = AbilityScoresFeature({}, {
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8
      });

      it("should return the correct base ability score", () => {
        expect(feature.getFixedAbilityScoreModifier("strength")).to.equal(15);
        expect(feature.getFixedAbilityScoreModifier("charisma")).to.equal(8);
      });

      it("should set the correct base ability score", () => {
        feature.setFixedAbilityScoreModifier("strength", 12);
        feature.setFixedAbilityScoreModifier("charisma", 6);
        expect(feature.getFixedAbilityScoreModifier("strength")).to.equal(12);
        expect(feature.getFixedAbilityScoreModifier("charisma")).to.equal(6);
      });

      it("should limit the base ability score to max 30", () => {
        feature.setFixedAbilityScoreModifier("strength", 33);
        expect(feature.getFixedAbilityScoreModifier("strength")).to.equal(30);
      });

      it("should limit the base ability score to min 3", () => {
        feature.setFixedAbilityScoreModifier("strength", 1);
        expect(feature.getFixedAbilityScoreModifier("strength")).to.equal(3);
      });
    });

    describe("Apply Modifiers", () => {
      let feature;

      beforeEach(() => {
        feature = AbilityScoresFeature(uniqueObject, {
          chooseUpTo: 2,
          choicesMade: 1,
          maxPerAbility: 1,
          chooseFrom: ["strength", "constitution"],
          chosen: {
            constitution: 1
          }
        });
      });

      it("should increase the ability score value when a modifier is applied", () => {
        feature.applyAbilityScoreModifierIncrease("strength");
        expect(feature["strength"].value).to.equal(1);
      });

      it("should decrease the ability score value when a modifier is removed", () => {
        feature.applyAbilityScoreModifierDecrease("constitution");
        expect(feature["constitution"].value).to.equal(0);
      });

      it("should ignore an increase that cannot be applied", () => {
        const res = feature.applyAbilityScoreModifierIncrease("constitution");
        expect(res).to.be.false;
        expect(feature["constitution"].value).to.equal(1);
      });

      it("should ignore a decrease that cannot be applied", () => {
        const res = feature.applyAbilityScoreModifierDecrease("strength");
        expect(res).to.be.false;
        expect(feature["strength"].value).to.equal(0);
      });

      it("should ignore an increase that is not in the list", () => {
        const res = feature.applyAbilityScoreModifierIncrease("dexterity");
        expect(res).to.be.false;
        expect(feature["strength"].value).to.equal(0);
      });

      it("should ignore a decrease that is not in the list", () => {
        const res = feature.applyAbilityScoreModifierDecrease("charisma");
        expect(res).to.be.false;
        expect(feature["strength"].value).to.equal(0);
      });
    });

    describe("Points buy", () => {
      let standardArrayFeature, pointsAvailableFeature, outOfRangeFeature;

      beforeEach(() => {
        standardArrayFeature = AbilityScoresFeature(uniqueObject, {
          strength: 15,
          dexterity: 14,
          constitution: 13,
          intelligence: 12,
          wisdom: 10,
          charisma: 8
        });

        pointsAvailableFeature = AbilityScoresFeature(uniqueObject, {
          strength: 15,
          dexterity: 14,
          constitution: 11,
          intelligence: 9,
          wisdom: 9,
          charisma: 8
        });

        outOfRangeFeature = AbilityScoresFeature(uniqueObject, {
          strength: 21,
          dexterity: 18,
          constitution: 16,
          intelligence: 7,
          wisdom: 4,
          charisma: -1
        });
      });

      it("should calculate available points correctly for standard array", () => {
        expect(standardArrayFeature.getPointsRemaining()).to.equal(0);
      });

      it("should calculate available points correctly for other values", () => {
        expect(pointsAvailableFeature.getPointsRemaining()).to.equal(6);
      });

      it("should calculate 0 points available if any ability is over the max", () => {
        expect(outOfRangeFeature.getPointsRemaining()).to.equal(0);
      });

      it("should calculate point buy cost correctly for values above maximum", () => {
        expect(outOfRangeFeature.getPointBuyCost(Abilities.CONSTITUTION)).to.be.NaN;
      });

      it("should calculate point buy cost correctly for values at maximum", () => {
        expect(standardArrayFeature.getPointBuyCost(Abilities.STRENGTH)).to.be.NaN;
      });

      it("should calculate point buy cost correctly for value 14", () => {
        expect(standardArrayFeature.getPointBuyCost(Abilities.DEXTERITY)).to.equal(2);
      });

      it("should calculate point buy cost correctly for value 13", () => {
        expect(standardArrayFeature.getPointBuyCost(Abilities.CONSTITUTION)).to.equal(2);
      });

      it("should calculate point buy cost correctly for value 12", () => {
        expect(standardArrayFeature.getPointBuyCost(Abilities.INTELLIGENCE)).to.equal(1);
      });

      it("should calculate point buy cost correctly for value 11", () => {
        expect(pointsAvailableFeature.getPointBuyCost(Abilities.CONSTITUTION)).to.equal(1);
      });

      it("should calculate point buy cost correctly for value 10", () => {
        expect(standardArrayFeature.getPointBuyCost(Abilities.WISDOM)).to.equal(1);
      });

      it("should calculate point buy cost correctly for value 9", () => {
        expect(pointsAvailableFeature.getPointBuyCost(Abilities.INTELLIGENCE)).to.equal(1);
      });

      it("should calculate point buy cost correctly for value 8", () => {
        expect(standardArrayFeature.getPointBuyCost(Abilities.CHARISMA)).to.equal(1);
      });

      it("should calculate point buy cost correctly for values below minimum", () => {
        expect(outOfRangeFeature.getPointBuyCost(Abilities.INTELLIGENCE)).to.equal(0);
      });

      it("should allow buying a point when available", () => {
        const res = pointsAvailableFeature.buyPoint(Abilities.DEXTERITY);
        expect(pointsAvailableFeature[Abilities.DEXTERITY].value).to.equal(15);
        expect(res).to.be.true;
      });

      it("should disallow buying a point when the score is already maxed", () => {
        const res = pointsAvailableFeature.buyPoint(Abilities.STRENGTH);
        expect(pointsAvailableFeature[Abilities.STRENGTH].value).to.equal(15);
        expect(res).to.be.false;
      });

      it("should disallow buying a point when all points are used", () => {
        const res = standardArrayFeature.buyPoint(Abilities.WISDOM);
        expect(standardArrayFeature[Abilities.WISDOM].value).to.equal(10);
        expect(res).to.be.false;
      });

      it("should allow buying a point when the score is below minimum", () => {
        const res = outOfRangeFeature.buyPoint(Abilities.WISDOM);
        expect(outOfRangeFeature[Abilities.WISDOM].value).to.equal(5);
        expect(res).to.be.true;
      });

      it("should calculate point sell value correctly for values above maximum", () => {
        expect(outOfRangeFeature.getPointSellValue(Abilities.CONSTITUTION)).to.be.NaN;
      });

      it("should calculate point sell value correctly for values at maximum", () => {
        expect(standardArrayFeature.getPointSellValue(Abilities.STRENGTH)).to.equal(2);
      });

      it("should calculate point sell value correctly for value 14", () => {
        expect(standardArrayFeature.getPointSellValue(Abilities.DEXTERITY)).to.equal(2);
      });

      it("should calculate point sell value correctly for value 13", () => {
        expect(standardArrayFeature.getPointSellValue(Abilities.CONSTITUTION)).to.equal(1);
      });

      it("should calculate point sell value correctly for value 12", () => {
        expect(standardArrayFeature.getPointSellValue(Abilities.INTELLIGENCE)).to.equal(1);
      });

      it("should calculate point sell value correctly for value 11", () => {
        expect(pointsAvailableFeature.getPointSellValue(Abilities.CONSTITUTION)).to.equal(1);
      });

      it("should calculate point sell value correctly for value 10", () => {
        expect(standardArrayFeature.getPointSellValue(Abilities.WISDOM)).to.equal(1);
      });

      it("should calculate point sell value correctly for value 9", () => {
        expect(pointsAvailableFeature.getPointSellValue(Abilities.INTELLIGENCE)).to.equal(1);
      });

      it("should calculate point sell value correctly for value 8", () => {
        expect(standardArrayFeature.getPointSellValue(Abilities.CHARISMA)).to.equal(0);
      });

      it("should calculate point sell value correctly for values below minimum", () => {
        expect(outOfRangeFeature.getPointSellValue(Abilities.INTELLIGENCE)).to.equal(0);
      });

      it("should allow selling a point when available", () => {
        const res = pointsAvailableFeature.sellPoint(Abilities.DEXTERITY);
        expect(pointsAvailableFeature[Abilities.DEXTERITY].value).to.equal(13);
        expect(res).to.be.true;
      });

      it("should disallow selling a point when the score is already at minimum", () => {
        const res = pointsAvailableFeature.sellPoint(Abilities.CHARISMA);
        expect(pointsAvailableFeature[Abilities.CHARISMA].value).to.equal(8);
        expect(res).to.be.false;
      });

      it("should allow selling a point when the score is above maximum", () => {
        const res = outOfRangeFeature.buyPoint(Abilities.WISDOM);
        expect(outOfRangeFeature[Abilities.WISDOM].value).to.equal(5);
        expect(res).to.be.true;
      });
    });
  });

  describe("AbilityScoresFeatureSet", () => {
    describe("Cumulative modifiers", () => {
      const featureSet = AbilityScoresFeatureSet({
        featureList: [
          AbilityScoresFeature({}, {
            strength: 1,
            dexterity: 1,
            constitution: 1,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
          }),

          AbilityScoresFeature({}, {
            strength: 1,
            dexterity: 1,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
          }),

          AbilityScoresFeature({}, {
            strength: 1,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,

            chooseUpTo: 2,
            choicesMade: 0,
            maxPerAbility: 2,
            chooseFrom: ["wisdom", "charisma"],
            chosen: {
              strength: 0,
              dexterity: 0,
              constitution: 0,
              intelligence: 0,
              wisdom: 0,
              charisma: 0
            }
          }),

          AbilityScoresFeature({}, {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,

            chooseUpTo: 2,
            choicesMade: 0,
            maxPerAbility: 1,
            chooseFrom: ["strength", "charisma"],
            chosen: {
              strength: 0,
              dexterity: 0,
              constitution: 0,
              intelligence: 0,
              wisdom: 0,
              charisma: 0
            }
          }),
        ]
      });

      it("should find no modifiers for an ability score when there are no features that modify the ability score", () => {
        const abilityInfo = featureSet.intelligence;
        expect(abilityInfo).to.deep.equal({modifiers: [], value: 0, base: 0, min: 0, max: 0, available: 0});
      });

      it("should find modifiers from every feature when every feature modifier the ability score", () => {
        const abilityInfo = featureSet.strength;
        expect(abilityInfo.modifiers).to.have.lengthOf(4);
      });

      it("should calculate the correct range for abilityScores with multiple optional features", () => {
        const abilityInfo = featureSet.charisma;
        expect(abilityInfo.min).to.equal(0);
        expect(abilityInfo.max).to.equal(3);
      });

      it("should calculate the correct range for abilityScores with multiple optional and fixed features", () => {
        const abilityInfo = featureSet.strength;
        expect(abilityInfo.min).to.equal(3);
        expect(abilityInfo.max).to.equal(4);
      });

      it("should calculate the correct range for abilityScores with no optional features", () => {
        const abilityInfo = featureSet.constitution;
        expect(abilityInfo.min).to.equal(1);
        expect(abilityInfo.max).to.equal(1);
      });

      it("should calculate the correct value for abilityScores with multiple optional features", () => {
        const abilityInfo = featureSet.charisma;
        expect(abilityInfo.value).to.equal(0);
      });

      it("should calculate the correct value for abilityScores with multiple optional and fixed features", () => {
        const abilityInfo = featureSet.strength;
        expect(abilityInfo.value).to.equal(3);
      });

      it("should calculate the correct value for abilityScores with no optional features", () => {
        const abilityInfo = featureSet.constitution;
        expect(abilityInfo.value).to.equal(1);
      });

      it("should calculate the correct availability for abilityScores with multiple optional features", () => {
        const abilityInfo = featureSet.charisma;
        expect(abilityInfo.available).to.equal(3);
      });

      it("should calculate the correct availability for abilityScores with multiple optional and fixed features", () => {
        const abilityInfo = featureSet.strength;
        expect(abilityInfo.available).to.equal(1);
      });

      it("should calculate the correct availability for abilityScores with no optional features", () => {
        const abilityInfo = featureSet.constitution;
        expect(abilityInfo.available).to.equal(0);
      });

      it("should return the same when using getters or getAbilityScoreModifiers with a named ability score", () => {
        expect(featureSet.strength).to.deep.equal(featureSet.getAbilityScoreModifiers("strength"));
        expect(featureSet.dexterity).to.deep.equal(featureSet.getAbilityScoreModifiers("dexterity"));
        expect(featureSet.constitution).to.deep.equal(featureSet.getAbilityScoreModifiers("constitution"));
        expect(featureSet.intelligence).to.deep.equal(featureSet.getAbilityScoreModifiers("intelligence"));
        expect(featureSet.wisdom).to.deep.equal(featureSet.getAbilityScoreModifiers("wisdom"));
        expect(featureSet.charisma).to.deep.equal(featureSet.getAbilityScoreModifiers("charisma"));
      });
    });

    describe("Base and modifiers", () => {
      const featureSet = AbilityScoresFeatureSet({
        featureList: [
          AbilityScoresFeature({}, {
            isBaseScore: true,
            strength: 15,
            dexterity: 14,
            constitution: 13,
            intelligence: 12,
            wisdom: 10,
            charisma: 8
          }),

          AbilityScoresFeature({}, {
            strength: 1,
            dexterity: 1,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,

            chooseUpTo: 2,
            choicesMade: 2,
            maxPerAbility: 2,
            chooseFrom: ["wisdom", "charisma"],
            chosen: {
              wisdom: 1,
              charisma: 1
            }
          }),

          AbilityScoresFeature({}, {
            isBaseScore: true,
            strength: 18
          }),

          AbilityScoresFeature({}, {
            strength: 1,

            chooseUpTo: 2,
            choicesMade: 1,
            maxPerAbility: 1,
            chooseFrom: ["strength", "dexterity"],
            chosen: {
              dexterity: 1
            }
          })
        ]
      });

      it("should ignore modifiers that are overridden by a base ", () => {
        const abilityInfo = featureSet.strength;
        expect(abilityInfo.modifiers).to.have.length(2);
        expect(abilityInfo.value).to.equal(19);
        expect(abilityInfo.base).to.equal(18);
        expect(abilityInfo.min).to.equal(19);
        expect(abilityInfo.max).to.equal(20);
        expect(abilityInfo.available).to.equal(1);
      });

      it("should not override values when a base value is not provided", () => {
        const abilityInfo = featureSet.dexterity;
        expect(abilityInfo.modifiers).to.have.length(3);
        expect(abilityInfo.value).to.equal(16);
        expect(abilityInfo.base).to.equal(14);
        expect(abilityInfo.min).to.equal(15);
        expect(abilityInfo.max).to.equal(16);
        expect(abilityInfo.available).to.equal(0);
      });
    });
  });
});
