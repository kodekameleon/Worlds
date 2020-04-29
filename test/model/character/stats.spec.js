import {expect} from "chai";
import {StatsFeatureSet} from "../../../src/model/character/stats";
import {UniqueObject} from "../../../src/model/unique-object";
import {CharacterStats, StatsFeature} from "../../../src/model/character";

const uniqueObject = UniqueObject({}, {name: "Elf", uniqueId: "elf-race-feature"});

describe("CharacterStats", () => {
  it("should set and get values", () => {
    const stats = CharacterStats();
    stats.strength = 5;
    stats.dexterity = 7;
    stats.constitution = 9;
    stats.intelligence = 11;
    stats.wisdom = 13;
    stats.charisma = 15;

    expect(stats.strength).to.equal(5);
    expect(stats.dexterity).to.equal(7);
    expect(stats.constitution).to.equal(9);
    expect(stats.intelligence).to.equal(11);
    expect(stats.wisdom).to.equal(13);
    expect(stats.charisma).to.equal(15);
  });

  it("should calculate bonuses correctly", () => {
    const stats = CharacterStats();
    stats.strength = 5;
    stats.dexterity = 6;
    stats.constitution = 9;
    stats.intelligence = 11;
    stats.wisdom = 13;
    stats.charisma = 16;

    expect(stats.bonus.strength).to.equal(-3);
    expect(stats.bonus.dexterity).to.equal(-2);
    expect(stats.bonus.constitution).to.equal(-1);
    expect(stats.bonus.intelligence).to.equal(0);
    expect(stats.bonus.wisdom).to.equal(1);
    expect(stats.bonus.charisma).to.equal(3);
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

  it("should report no changes available for an empty object", () => {
    const feat = StatsFeature(uniqueObject);
    expect(feat.strength).to.deep.equal({source: uniqueObject, value: 0, min: 0, max: 0, available: 0});
  });

  it("should return the same when using getters or getStatModifiers with a named stat", () => {
    const template = {
      strength: 0,
      dexterity: 1,
      constitution: 2,
      intelligence: 3,
      wisdom: 4,
      charisma: 5
    };
    const feat = StatsFeature({}, template);

    expect(feat.strength).to.deep.equal(feat.getModifier("strength"));
    expect(feat.dexterity).to.deep.equal(feat.getModifier("dexterity"));
    expect(feat.constitution).to.deep.equal(feat.getModifier("constitution"));
    expect(feat.intelligence).to.deep.equal(feat.getModifier("intelligence"));
    expect(feat.wisdom).to.deep.equal(feat.getModifier("wisdom"));
    expect(feat.charisma).to.deep.equal(feat.getModifier("charisma"));
  });

  describe("Detect changes", () => {
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

    it("should report that a stat has changes if there are no changes", () => {
      expect(feature.hasModifier("strength")).to.equal(false);
    });

    it("should report that a stat has changes if there is a fixed change", () => {
      expect(feature.hasModifier("dexterity")).to.equal(true);
    });

    it("should report that a stat has changes if there is an optional change", () => {
      expect(feature.hasModifier("constitution")).to.equal(true);
    });
  });

  describe("Fixed changes", () => {
    const template = {
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
    };
    const feature = StatsFeature(uniqueObject, template);

    it("should report correct change when stat is not changed", () => {
      expect(feature.strength.value).to.equal(0);
    });

    it("should report correct change when stat is changed", () => {
      expect(feature.dexterity.value).to.equal(1);
    });

    it("should report same min/max when not in the optional list", () => {
      expect(feature.strength.min).to.equal(feature.strength.max);
      expect(feature.strength.min).to.equal(0);
    });

    it("should report optional changes are allowed when in the optional list", () => {
      expect(feature.constitution.min).to.not.equal(feature.constitution.max);
    });
  });

  describe("Single choice allowed per stat", () => {
    const template = {
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
    };
    const feature = StatsFeature(uniqueObject, template);

    const templateUnassigned = {
      chooseUpTo: 2,
      choicesMade: 0,
      maxPerStat: 1,
      chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"]
    };
    const featureUnassigned = StatsFeature(uniqueObject, templateUnassigned);

    const templateAssigned1 = {
      chooseUpTo: 2,
      choicesMade: 1,
      maxPerStat: 1,
      chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
      chosen: {
        constitution: 1
      }
    };
    const featureAssigned1 = StatsFeature(uniqueObject, templateAssigned1);

    const templateAssigned2 = {
      chooseUpTo: 2,
      choicesMade: 2,
      maxPerStat: 1,
      chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
      chosen: {
        constitution: 1,
        intelligence: 1
      }
    };
    const featureAssigned2 = StatsFeature(uniqueObject, templateAssigned2);

    it("should report correct values when stat cannot be changed", () => {
      expect(feature.strength).to.deep.equal({source: uniqueObject, value: 0, min: 0, max: 0, available: 0});
    });

    it("should report correct values when stat has not been changed", () => {
      expect(feature.dexterity).to.deep.equal({source: uniqueObject, value: 1, min: 1, max: 2, available: 1});
    });

    it("should report correct values when stat has been changed to its limit", () => {
      expect(feature.constitution).to.deep.equal({source: uniqueObject, value: 1, min: 0, max: 1, available: 0});
    });

    it("should report correct values when stat has a change below the minimum", () => {
      expect(feature.wisdom).to.deep.equal({source: uniqueObject, value: -1, min: 0, max: 1, available: 1});
    });

    it("should report correct values when stat has a change above the maximum", () => {
      expect(feature.charisma).to.deep.equal({source: uniqueObject, value: 3, min: 1, max: 2, available: 0});
    });

    it("should report correct availability when no option is assigned and stat cannot be changed", () => {
      expect(featureUnassigned.strength.available).to.equal(0);
    });

    it("should report correct availability when no option is assigned and stat can be changed", () => {
      expect(featureUnassigned.dexterity.available).to.equal(1);
    });

    it("should report correct availability when one option is assigned and the stat cannot be changed", () => {
      expect(featureAssigned1.strength.available).to.equal(0);
    });

    it("should report correct availability when one option is assigned and stat can be changed", () => {
      expect(featureAssigned1.dexterity.available).to.equal(1);
    });

    it("should report correct availability when one option is assigned and stat has been changed", () => {
      expect(featureAssigned1.constitution.available).to.equal(0);
    });

    it("should report correct availability when two options are assigned and the stat cannot be changed", () => {
      expect(featureAssigned2.strength.available).to.equal(0);
    });

    it("should report correct availability when two options are assigned and stat can be changed", () => {
      expect(featureAssigned2.dexterity.available).to.equal(0);
    });

    it("should report correct availability when two options are assigned and stat has been changed", () => {
      expect(featureAssigned2.constitution.available).to.equal(0);
    });
  });

  describe("Multiple choices allowed per stat", () => {
    const template = {
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
    };
    const feature = StatsFeature(uniqueObject, template);

    const templateUnassigned = {
      chooseUpTo: 2,
      choicesMade: 0,
      maxPerStat: 2,
      chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"]
    };
    const featureUnassigned = StatsFeature(uniqueObject, templateUnassigned);

    const templateAssigned1 = {
      chooseUpTo: 2,
      choicesMade: 1,
      maxPerStat: 2,
      chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
      chosen: {
        constitution: 1
      }
    };
    const featureAssigned1 = StatsFeature(uniqueObject, templateAssigned1);

    const templateAssigned2 = {
      chooseUpTo: 2,
      choicesMade: 2,
      maxPerStat: 2,
      chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
      chosen: {
        constitution: 1,
        intelligence: 1
      }
    };
    const featureAssigned2 = StatsFeature(uniqueObject, templateAssigned2);

    const templateAssigned2OnOne = {
      chooseUpTo: 2,
      choicesMade: 2,
      maxPerStat: 2,
      chooseFrom: ["dexterity", "constitution", "intelligence", "wisdom", "charisma"],
      chosen: {
        constitution: 2
      }
    };
    const featureAssigned2OnOne = StatsFeature(uniqueObject, templateAssigned2OnOne);

    it("should report correct values when stat cannot be changed", () => {
      expect(feature.strength).to.deep.equal({source: uniqueObject, value: 0, min: 0, max: 0, available: 0});
    });

    it("should report correct values when stat has not been changed", () => {
      expect(feature.dexterity).to.deep.equal({source: uniqueObject, value: 1, min: 1, max: 3, available: 2});
    });

    it("should report correct values when stat has been changed", () => {
      expect(feature.constitution).to.deep.equal({source: uniqueObject, value: 1, min: 0, max: 2, available: 1});
    });

    it("should report correct values when stat has been changed to its limit", () => {
      expect(feature.intelligence).to.deep.equal({source: uniqueObject, value: 3, min: 1, max: 3, available: 0});
    });

    it("should report correct values when stat has a change below the minimum", () => {
      expect(feature.wisdom).to.deep.equal({source: uniqueObject, value: -1, min: 0, max: 2, available: 2});
    });

    it("should report correct values when stat has a change above the maximum", () => {
      expect(feature.charisma).to.deep.equal({source: uniqueObject, value: 4, min: 1, max: 3, available: 0});
    });

    it("should report correct availability when no option is assigned and stat cannot be changed", () => {
      expect(featureUnassigned.strength.available).to.equal(0);
    });

    it("should report correct availability when no option is assigned and stat can be changed", () => {
      expect(featureUnassigned.dexterity.available).to.equal(2);
    });

    it("should report correct availability when one option is assigned and the stat cannot be changed", () => {
      expect(featureAssigned1.strength.available).to.equal(0);
    });

    it("should report correct availability when one option is assigned and stat can be changed", () => {
      expect(featureAssigned1.dexterity.available).to.equal(1);
    });

    it("should report correct availability when one option is assigned and stat has been changed", () => {
      expect(featureAssigned1.constitution.available).to.equal(1);
    });

    it("should report correct availability when two options are assigned and the stat cannot be changed", () => {
      expect(featureAssigned2.strength.available).to.equal(0);
    });

    it("should report correct availability when two options are assigned and stat can be changed", () => {
      expect(featureAssigned2.dexterity.available).to.equal(0);
    });

    it("should report correct availability when two options are assigned and stat has been changed", () => {
      expect(featureAssigned2.constitution.available).to.equal(0);
    });

    it("should report correct availability when two options are assigned to one stat and the stat cannot be changed", () => {
      expect(featureAssigned2OnOne.strength.available).to.equal(0);
    });

    it("should report correct availability when two options are assigned to one stat and stat can be changed", () => {
      expect(featureAssigned2OnOne.dexterity.available).to.equal(0);
    });

    it("should report correct availability when two options are assigned to one stat and stat has been changed", () => {
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
});

describe("StatsFeatureSet", () => {
  const featureList = [
    StatsFeature({}, {
      strength: 1,
      dexterity: 1,
      constitution: 1,
      intelligence: 0,
      wisdom: 0,
      charisma: 0}),

    StatsFeature({}, {
      strength: 1,
      dexterity: 1,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0}),

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
  ];

  const featureSet = StatsFeatureSet({featureList});

  it("should find no changes for a stat when there are no features that change the stat", () => {
    const stats = featureSet.intelligence;
    expect(stats).to.deep.equal({modifiers: [], value: 0, base: 0, min: 0, max: 0, available: 0});
  });

  it("should find changes from every feature when every feature change the stat", () => {
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
