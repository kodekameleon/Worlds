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
    get strength() { return getModifier(CharacterStatProp.STRENGTH); },
    get dexterity() { return getModifier(CharacterStatProp.DEXTERITY); },
    get constitution() { return getModifier(CharacterStatProp.CONSTITUTION); },
    get intelligence() { return getModifier(CharacterStatProp.INTELLIGENCE); },
    get wisdom() { return getModifier(CharacterStatProp.WISDOM); },
    get charisma() { return getModifier(CharacterStatProp.CHARISMA); },

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
        a.min += modifier.min;
        a.max += modifier.max;
        a.available += modifier.available;
      }
      return a;
    },
    {
      modifiers: [],
      value: 0,
      min: 0,
      max: 0,
      available: 0
    });
  }
}
