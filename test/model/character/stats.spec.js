import {ANY} from "../../../src/constants";
import {expect} from "chai";
import {StatsFeatureSet} from "../../../src/model/character/stats";
import {UniqueObject} from "../../../src/model/unique-object";
import {Character,  StatsFeature} from "../../../src/model/character";

const uniqueObject = UniqueObject({}, {name: "Elf", uniqueId: "elf-race-feature"});

describe("Stats", () => {
  describe("CharacterStats", () => {
    const character = Character();
    character.features.featureList.push(StatsFeature({}, {
      isBaseStat: true,
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
  });

  describe("StatsFeature", () => {
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
        maxPerStat: 2,
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

      const feat = StatsFeature({}, orig);
      const serialized = feat.serialize();

      expect(serialized).to.deep.equalInAnyOrder(orig);
    });

    it("should serialize without undefined values", () => {
      const feat = StatsFeature({});
      const serialized = feat.serialize();

      expect(serialized).to.deep.equal({});
    });

    it("should report no modifiers available for an empty object", () => {
      const feat = StatsFeature(uniqueObject);
      expect(feat.strength).to.deep.equal({source: uniqueObject, value: 0, min: 0, max: 0, available: 0});
    });

    it("should return the same when using getters or getStatModifiers with a named stat", () => {
      const feat = StatsFeature({}, {
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
      const feature = StatsFeature({}, {
        chooseFrom: ["strength"]
      });
      expect(feature.hasModifier("strength")).to.be.true;
    });

    it("should recognize an optional modifier is not present when it is not listed", () => {
      const feature = StatsFeature({}, {
        chooseFrom: ["strength"]
      });
      expect(feature.hasModifier("dexterity")).to.be.false;
    });

    it("should recognize an optional modifier is not present when it is not listed", () => {
      const feature = StatsFeature({}, {
        chooseFrom: ANY
      });
      expect(feature.hasModifier("dexterity")).to.be.true;
    });

    describe("Detect modifiers", () => {
      const feature = StatsFeature({}, {
        strength: 0,
        dexterity: 1,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,

        chooseUpTo: 2,
        choicesMade: 0,
        maxPerStat: 1,
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

      it("should report that a stat has no modifiers if there are no modifiers", () => {
        expect(feature.hasModifier("strength")).to.equal(false);
      });

      it("should report that a stat has modifiers if there is a fixed modifier", () => {
        expect(feature.hasModifier("dexterity")).to.equal(true);
      });

      it("should report that a stat has modifiers if there is an optional modifier", () => {
        expect(feature.hasModifier("constitution")).to.equal(true);
      });
    });

    describe("Fixed modifiers", () => {
      const feature = StatsFeature(uniqueObject, {
        strength: 0,
        dexterity: 1,
        constitution: 0,
        intelligence: 1,
        wisdom: 0,
        charisma: 1,

        chooseUpTo: 2,
        choicesMade: 0,
        maxPerStat: 2,
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

      it("should report correct modifier when stat is not modified", () => {
        expect(feature.strength.value).to.equal(0);
      });

      it("should report correct modifier when stat is modified", () => {
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

    describe("Single choice allowed per stat", () => {
      const feature = StatsFeature(uniqueObject, {
        strength: 0,
        dexterity: 1,
        constitution: 0,
        intelligence: 1,
        wisdom: 0,
        charisma: 1,

        chooseUpTo: 2,
        choicesMade: 0,
        maxPerStat: 1,
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

      const featureUnassigned = StatsFeature(uniqueObject, {
        chooseUpTo: 2,
        choicesMade: 0,
        maxPerStat: 1,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"]
      });

      const featureAssigned1 = StatsFeature(uniqueObject, {
        chooseUpTo: 2,
        choicesMade: 1,
        maxPerStat: 1,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
        chosen: {
          constitution: 1
        }
      });

      const featureAssigned2 = StatsFeature(uniqueObject, {
        chooseUpTo: 2,
        choicesMade: 2,
        maxPerStat: 1,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
        chosen: {
          constitution: 1,
          intelligence: 1
        }
      });

      it("should report correct values when stat cannot be modified", () => {
        expect(feature.strength).to.deep.equal({source: uniqueObject, value: 0, min: 0, max: 0, available: 0});
      });

      it("should report correct values when stat has not been modified", () => {
        expect(feature.dexterity).to.deep.equal({source: uniqueObject, value: 1, min: 1, max: 2, available: 1});
      });

      it("should report correct values when stat has been modified to its limit", () => {
        expect(feature.constitution).to.deep.equal({source: uniqueObject, value: 1, min: 0, max: 1, available: 0});
      });

      it("should report correct values when stat has a modifier below the minimum", () => {
        expect(feature.wisdom).to.deep.equal({source: uniqueObject, value: -1, min: 0, max: 1, available: 1});
      });

      it("should report correct values when stat has a modifier above the maximum", () => {
        expect(feature.charisma).to.deep.equal({source: uniqueObject, value: 3, min: 1, max: 2, available: 0});
      });

      it("should report correct availability when no option is assigned and stat cannot be modified", () => {
        expect(featureUnassigned.strength.available).to.equal(0);
      });

      it("should report correct availability when no option is assigned and stat can be modified", () => {
        expect(featureUnassigned.dexterity.available).to.equal(1);
      });

      it("should report correct availability when one option is assigned and the stat cannot be modified", () => {
        expect(featureAssigned1.strength.available).to.equal(0);
      });

      it("should report correct availability when one option is assigned and stat can be modified", () => {
        expect(featureAssigned1.dexterity.available).to.equal(1);
      });

      it("should report correct availability when one option is assigned and stat has been modified", () => {
        expect(featureAssigned1.constitution.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned and the stat cannot be modified", () => {
        expect(featureAssigned2.strength.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned and stat can be modified", () => {
        expect(featureAssigned2.dexterity.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned and stat has been modified", () => {
        expect(featureAssigned2.constitution.available).to.equal(0);
      });
    });

    describe("Multiple choices allowed per stat", () => {
      const feature = StatsFeature(uniqueObject, {
        strength: 0,
        dexterity: 1,
        constitution: 0,
        intelligence: 1,
        wisdom: 0,
        charisma: 1,

        chooseUpTo: 2,
        choicesMade: 0,
        maxPerStat: 2,
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

      const featureUnassigned = StatsFeature(uniqueObject, {
        chooseUpTo: 2,
        choicesMade: 0,
        maxPerStat: 2,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"]
      });

      const featureAssigned1 = StatsFeature(uniqueObject, {
        chooseUpTo: 2,
        choicesMade: 1,
        maxPerStat: 2,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
        chosen: {
          constitution: 1
        }
      });

      const featureAssigned2 = StatsFeature(uniqueObject, {
        chooseUpTo: 2,
        choicesMade: 2,
        maxPerStat: 2,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
        chosen: {
          constitution: 1,
          intelligence: 1
        }
      });

      const featureAssigned2OnOne = StatsFeature(uniqueObject, {
        chooseUpTo: 2,
        choicesMade: 2,
        maxPerStat: 2,
        chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
        chosen: {
          constitution: 2
        }
      });

      it("should report correct values when stat cannot be modified", () => {
        expect(feature.strength).to.deep.equal({source: uniqueObject, value: 0, min: 0, max: 0, available: 0});
      });

      it("should report correct values when stat has not been modified", () => {
        expect(feature.dexterity).to.deep.equal({source: uniqueObject, value: 1, min: 1, max: 3, available: 2});
      });

      it("should report correct values when stat has been modified", () => {
        expect(feature.constitution).to.deep.equal({source: uniqueObject, value: 1, min: 0, max: 2, available: 1});
      });

      it("should report correct values when stat has been modified to its limit", () => {
        expect(feature.intelligence).to.deep.equal({source: uniqueObject, value: 3, min: 1, max: 3, available: 0});
      });

      it("should report correct values when stat has a modifier below the minimum", () => {
        expect(feature.wisdom).to.deep.equal({source: uniqueObject, value: -1, min: 0, max: 2, available: 2});
      });

      it("should report correct values when stat has a modifier above the maximum", () => {
        expect(feature.charisma).to.deep.equal({source: uniqueObject, value: 4, min: 1, max: 3, available: 0});
      });

      it("should report correct availability when no option is assigned and stat cannot be modified", () => {
        expect(featureUnassigned.strength.available).to.equal(0);
      });

      it("should report correct availability when no option is assigned and stat can be modified", () => {
        expect(featureUnassigned.dexterity.available).to.equal(2);
      });

      it("should report correct availability when one option is assigned and the stat cannot be modified", () => {
        expect(featureAssigned1.strength.available).to.equal(0);
      });

      it("should report correct availability when one option is assigned and stat can be modified", () => {
        expect(featureAssigned1.dexterity.available).to.equal(1);
      });

      it("should report correct availability when one option is assigned and stat has been modified", () => {
        expect(featureAssigned1.constitution.available).to.equal(1);
      });

      it("should report correct availability when two options are assigned and the stat cannot be modified", () => {
        expect(featureAssigned2.strength.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned and stat can be modified", () => {
        expect(featureAssigned2.dexterity.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned and stat has been modified", () => {
        expect(featureAssigned2.constitution.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned to one stat and the stat cannot be modified", () => {
        expect(featureAssigned2OnOne.strength.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned to one stat and stat can be modified", () => {
        expect(featureAssigned2OnOne.dexterity.available).to.equal(0);
      });

      it("should report correct availability when two options are assigned to one stat and stat has been modified", () => {
        expect(featureAssigned2OnOne.constitution.available).to.equal(0);
      });
    });

    describe("Partially defined", () => {
      const feature = StatsFeature({}, {
        intelligence: 1,
        wisdom: 1,
        charisma: 1,
        chooseUpTo: 2,
        maxPerStat: 1,
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

    describe("Change base stat", () => {
      const feature = StatsFeature({}, {
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8
      });

      it("should return the correct base stat", () => {
        expect(feature.getFixedStatModifier("strength")).to.equal(15);
        expect(feature.getFixedStatModifier("charisma")).to.equal(8);
      });

      it("should set the correct base stat", () => {
        feature.setFixedStatModifier("strength", 12);
        feature.setFixedStatModifier("charisma", 6);
        expect(feature.getFixedStatModifier("strength")).to.equal(12);
        expect(feature.getFixedStatModifier("charisma")).to.equal(6);
      });
    });

    describe("Apply Modifiers", () => {
      let feature;

      beforeEach(() => {
        feature = StatsFeature(uniqueObject, {
          chooseUpTo: 2,
          choicesMade: 1,
          maxPerStat: 1,
          chooseFrom: ["strength", "constitution"],
          chosen: {
            constitution: 1
          }
        });
      });

      it("should increase the stat value when a modifier is applied", () => {
        feature.applyStatModifierIncrease("strength");
        expect(feature["strength"].value).to.equal(1);
      });

      it("should decrease the stat value when a modifier is removed", () => {
        feature.applyStatModifierDecrease("constitution");
        expect(feature["constitution"].value).to.equal(0);
      });

      it("should ignore an increase that cannot be applied", () => {
        const res = feature.applyStatModifierIncrease("constitution");
        expect(res).to.be.false;
        expect(feature["constitution"].value).to.equal(1);
      });

      it("should ignore a decrease that cannot be applied", () => {
        const res = feature.applyStatModifierDecrease("strength");
        expect(res).to.be.false;
        expect(feature["strength"].value).to.equal(0);
      });

      it("should ignore an increase that is not in the list", () => {
        const res = feature.applyStatModifierIncrease("dexterity");
        expect(res).to.be.false;
        expect(feature["strength"].value).to.equal(0);
      });

      it("should ignore a decrease that is not in the list", () => {
        const res = feature.applyStatModifierDecrease("charisma");
        expect(res).to.be.false;
        expect(feature["strength"].value).to.equal(0);
      });
    });
  });

  describe("StatsFeatureSet", () => {
    describe("Cumulative modifiers", () => {
      const featureSet = StatsFeatureSet({
        featureList: [
          StatsFeature({}, {
            strength: 1,
            dexterity: 1,
            constitution: 1,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
          }),

          StatsFeature({}, {
            strength: 1,
            dexterity: 1,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
          }),

          StatsFeature({}, {
            strength: 1,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,

            chooseUpTo: 2,
            choicesMade: 0,
            maxPerStat: 2,
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

          StatsFeature({}, {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,

            chooseUpTo: 2,
            choicesMade: 0,
            maxPerStat: 1,
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

      it("should find no modifiers for a stat when there are no features that modify the stat", () => {
        const stats = featureSet.intelligence;
        expect(stats).to.deep.equal({modifiers: [], value: 0, base: 0, min: 0, max: 0, available: 0});
      });

      it("should find modifiers from every feature when every feature modifier the stat", () => {
        const stats = featureSet.strength;
        expect(stats.modifiers).to.have.lengthOf(4);
      });

      it("should calculate the correct range for stats with multiple optional features", () => {
        const stats = featureSet.charisma;
        expect(stats.min).to.equal(0);
        expect(stats.max).to.equal(3);
      });

      it("should calculate the correct range for stats with multiple optional and fixed features", () => {
        const stats = featureSet.strength;
        expect(stats.min).to.equal(3);
        expect(stats.max).to.equal(4);
      });

      it("should calculate the correct range for stats with no optional features", () => {
        const stats = featureSet.constitution;
        expect(stats.min).to.equal(1);
        expect(stats.max).to.equal(1);
      });

      it("should calculate the correct value for stats with multiple optional features", () => {
        const stats = featureSet.charisma;
        expect(stats.value).to.equal(0);
      });

      it("should calculate the correct value for stats with multiple optional and fixed features", () => {
        const stats = featureSet.strength;
        expect(stats.value).to.equal(3);
      });

      it("should calculate the correct value for stats with no optional features", () => {
        const stats = featureSet.constitution;
        expect(stats.value).to.equal(1);
      });

      it("should calculate the correct availability for stats with multiple optional features", () => {
        const stats = featureSet.charisma;
        expect(stats.available).to.equal(3);
      });

      it("should calculate the correct availability for stats with multiple optional and fixed features", () => {
        const stats = featureSet.strength;
        expect(stats.available).to.equal(1);
      });

      it("should calculate the correct availability for stats with no optional features", () => {
        const stats = featureSet.constitution;
        expect(stats.available).to.equal(0);
      });

      it("should return the same when using getters or getStatModifiers with a named stat", () => {
        expect(featureSet.strength).to.deep.equal(featureSet.getStatModifiers("strength"));
        expect(featureSet.dexterity).to.deep.equal(featureSet.getStatModifiers("dexterity"));
        expect(featureSet.constitution).to.deep.equal(featureSet.getStatModifiers("constitution"));
        expect(featureSet.intelligence).to.deep.equal(featureSet.getStatModifiers("intelligence"));
        expect(featureSet.wisdom).to.deep.equal(featureSet.getStatModifiers("wisdom"));
        expect(featureSet.charisma).to.deep.equal(featureSet.getStatModifiers("charisma"));
      });
    });

    describe("Base and modifiers", () => {
      const featureSet = StatsFeatureSet({
        featureList: [
          StatsFeature({}, {
            isBaseStat: true,
            strength: 15,
            dexterity: 14,
            constitution: 13,
            intelligence: 12,
            wisdom: 10,
            charisma: 8
          }),

          StatsFeature({}, {
            strength: 1,
            dexterity: 1,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,

            chooseUpTo: 2,
            choicesMade: 2,
            maxPerStat: 2,
            chooseFrom: ["wisdom", "charisma"],
            chosen: {
              wisdom: 1,
              charisma: 1
            }
          }),

          StatsFeature({}, {
            isBaseStat: true,
            strength: 18
          }),

          StatsFeature({}, {
            strength: 1,

            chooseUpTo: 2,
            choicesMade: 1,
            maxPerStat: 1,
            chooseFrom: ["strength", "dexterity"],
            chosen: {
              dexterity: 1
            }
          })
        ]
      });

      it("should ignore modifiers that are overridden by a base ", () => {
        const stats = featureSet.strength;
        expect(stats.modifiers).to.have.length(2);
        expect(stats.value).to.equal(19);
        expect(stats.base).to.equal(18);
        expect(stats.min).to.equal(19);
        expect(stats.max).to.equal(20);
        expect(stats.available).to.equal(1);
      });

      it("should not override values when a base value is not provided", () => {
        const stats = featureSet.dexterity;
        expect(stats.modifiers).to.have.length(3);
        expect(stats.value).to.equal(16);
        expect(stats.base).to.equal(14);
        expect(stats.min).to.equal(15);
        expect(stats.max).to.equal(16);
        expect(stats.available).to.equal(0);
      });
    });
  });
});
