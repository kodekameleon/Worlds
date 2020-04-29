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

export function CharacterStats(state) {
  const self = {};

  return {
    get strength() { return getStat(CharacterStatProp.STRENGTH); },
    get dexterity() { return getStat(CharacterStatProp.DEXTERITY); },
    get constitution() { return getStat(CharacterStatProp.CONSTITUTION); },
    get intelligence() { return getStat(CharacterStatProp.INTELLIGENCE); },
    get wisdom() { return getStat(CharacterStatProp.WISDOM); },
    get charisma() { return getStat(CharacterStatProp.CHARISMA); },

    set strength(v) { self.strength = v; },
    set dexterity(v) { self.dexterity = v; },
    set constitution(v) { self.constitution = v; },
    set intelligence(v) { self.intelligence = v; },
    set wisdom(v) { self.wisdom = v; },
    set charisma(v) { self.charisma = v; },

    bonus: {
      get strength() { return calcStatBonus(getStat(CharacterStatProp.STRENGTH)); },
      get dexterity() { return calcStatBonus(getStat(CharacterStatProp.DEXTERITY)); },
      get constitution() { return calcStatBonus(getStat(CharacterStatProp.CONSTITUTION)); },
      get intelligence() { return calcStatBonus(getStat(CharacterStatProp.INTELLIGENCE)); },
      get wisdom() { return calcStatBonus(getStat(CharacterStatProp.WISDOM)); },
      get charisma() { return calcStatBonus(getStat(CharacterStatProp.CHARISMA)); },
    }
  };

  function getStat(stat) {
    return state.features[stat].value;
  }

  function calcStatBonus(n) {
    return Math.floor((n - 10) / 2);
  }
}

export function StatsFeature(state, copyFrom) {
  const self = {
    isBaseStat: null,

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
    get strength() { return getModifier(CharacterStatProp.STRENGTH); },
    get dexterity() { return getModifier(CharacterStatProp.DEXTERITY); },
    get constitution() { return getModifier(CharacterStatProp.CONSTITUTION); },
    get intelligence() { return getModifier(CharacterStatProp.INTELLIGENCE); },
    get wisdom() { return getModifier(CharacterStatProp.WISDOM); },
    get charisma() { return getModifier(CharacterStatProp.CHARISMA); },

    get isBaseStat() { return self.isBaseStat; },

    getModifier: (prop) => getModifier(prop),
    hasModifier: (prop) => self[prop] || self.chooseFrom.includes(prop) ? true : false,

    serialize: () => Language.deflate(self)
  };

  function getModifier(prop) {
    const available = (self.chooseFrom.includes(ANY) || self.chooseFrom.includes(prop))
      && self.chooseUpTo > self.choicesMade
      && self.maxPerStat > self.chosen[prop]
      ? Math.min(self.chooseUpTo - self.choicesMade, self.maxPerStat - Math.max(self.chosen[prop], 0))
      : 0;
    return {
      source: UniqueObject(undefined, state),
      value: self[prop] + self.chosen[prop],
      min: +self[prop],
      max: +self[prop] + ((self.chooseFrom.includes(ANY) || self.chooseFrom.includes(prop)) && self.maxPerStat),
      available
    };
  }
}

export function StatsFeatureSet(state) {
  return {
    get strength() { return getStatModifiers(CharacterStatProp.STRENGTH); },
    get dexterity() { return getStatModifiers(CharacterStatProp.DEXTERITY); },
    get constitution() { return getStatModifiers(CharacterStatProp.CONSTITUTION); },
    get intelligence() { return getStatModifiers(CharacterStatProp.INTELLIGENCE); },
    get wisdom() { return getStatModifiers(CharacterStatProp.WISDOM); },
    get charisma() { return getStatModifiers(CharacterStatProp.CHARISMA); },

    getStatModifiers: (prop) => getStatModifiers(prop)
  };

  function getStatModifiers(prop) {
    return state.featureList.reduce((a, feature) => {
      if (feature.hasModifier(prop)) {
        const modifier = feature[prop];
        a.modifiers.push(modifier);
        a.value += modifier.value;
        a.base = feature.isBaseStat ? modifier.value : a.base;
        a.min += modifier.min;
        a.max += modifier.max;
        a.available += modifier.available;
      }
      return a;
    },
    {
      modifiers: [],
      value: 0,
      base: 0,
      min: 0,
      max: 0,
      available: 0
    });
  }
}
