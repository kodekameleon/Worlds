import {ANY} from "../../constants";
import {Language} from "../../utils";
import {UniqueObject} from "../unique-object";

export const CharacterStatProp = {
  STRENGTH: "strength",
  DEXTERITY: "dexterity",
  CONSTITUTION: "constitution",
  INTELLIGENCE: "intelligence",
  WISDOM: "wisdom",
  CHARISMA: "charisma"
};

export function CharacterStats() {
  const self = {
    strength: undefined,
    dexterity: undefined,
    constitution: undefined,
    intelligence: undefined,
    wisdom: undefined,
    charisma: undefined
  };

  return {
    get strength() { return self.strength; },
    set strength(v) { self.strength = v; },
    get dexterity() { return self.dexterity; },
    set dexterity(v) { self.dexterity = v; },
    get constitution() { return self.constitution; },
    set constitution(v) { self.constitution = v; },
    get intelligence() { return self.intelligence; },
    set intelligence(v) { self.intelligence = v; },
    get wisdom() { return self.wisdom; },
    set wisdom(v) { self.wisdom = v; },
    get charisma() { return self.charisma; },
    set charisma(v) { self.charisma = v; },

    bonus: {
      get strength() { return calcStatBonus(self.strength); },
      get dexterity() { return calcStatBonus(self.dexterity); },
      get constitution() { return calcStatBonus(self.constitution); },
      get intelligence() { return calcStatBonus(self.intelligence); },
      get wisdom() { return calcStatBonus(self.wisdom); },
      get charisma() { return calcStatBonus(self.charisma); },
    }
  };

  function calcStatBonus(n) {
    return Math.floor((n - 10) / 2);
  }
}

export function StatsFeature(state, copyFrom) {
  const self = {
    strength: null,
    dexterity: null,
    constitution: null,
    intelligence: null,
    wisdom: null,
    charisma: null,

    chooseUpTo: null,
    choicesMade: null,
    maxPerStat: null,
    chooseFrom: [],
    chosen: {
      strength: null,
      dexterity: null,
      constitution: null,
      intelligence: null,
      wisdom: null,
      charisma: null
    }
  };
  Language.assignOverwrite(self, copyFrom);

  return {
    get strength() { return getChange(CharacterStatProp.STRENGTH); },
    get dexterity() { return getChange(CharacterStatProp.DEXTERITY); },
    get constitution() { return getChange(CharacterStatProp.CONSTITUTION); },
    get intelligence() { return getChange(CharacterStatProp.INTELLIGENCE); },
    get wisdom() { return getChange(CharacterStatProp.WISDOM); },
    get charisma() { return getChange(CharacterStatProp.CHARISMA); },

    getChange: (prop) => getChange(prop),
    hasChange: (prop) => self[prop] || self.chooseFrom.includes(prop) ? true : false,

    serialize: () => Language.deflate(self)
  };

  function getChange(prop) {
    return {
      source: UniqueObject(undefined, state),
      value: self[prop] + self.chosen[prop],
      min: +self[prop],
      max: (self.chooseFrom.includes(ANY) || self.chooseFrom.includes(prop)) ? self[prop] + self.maxPerStat : +self[prop]
    };
  }
}

export function StatsFeatureSet(state) {
  return {
    get strength() { return getStatSources(CharacterStatProp.STRENGTH); },
    get dexterity() { return getStatSources(CharacterStatProp.DEXTERITY); },
    get constitution() { return getStatSources(CharacterStatProp.CONSTITUTION); },
    get intelligence() { return getStatSources(CharacterStatProp.INTELLIGENCE); },
    get wisdom() { return getStatSources(CharacterStatProp.WISDOM); },
    get charisma() { return getStatSources(CharacterStatProp.CHARISMA); },

    getStatSources: (prop) => getStatSources(prop)
  };

  function getStatSources(prop) {
    return state.featureList.reduce((a, feature) => {
      if (feature.hasChange(prop)) {
        const source = feature[prop];
        a.sources.push(source);
        a.value += source.value;
        a.min += source.min;
        a.max += source.max;
      }
      return a;
    },
    {
      sources: [],
      value: 0,
      min: 0,
      max: 0
    });
  }
}
