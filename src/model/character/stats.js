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
  return {
    get strength() { return getStatValue(CharacterStatProp.STRENGTH); },
    get dexterity() { return getStatValue(CharacterStatProp.DEXTERITY); },
    get constitution() { return getStatValue(CharacterStatProp.CONSTITUTION); },
    get intelligence() { return getStatValue(CharacterStatProp.INTELLIGENCE); },
    get wisdom() { return getStatValue(CharacterStatProp.WISDOM); },
    get charisma() { return getStatValue(CharacterStatProp.CHARISMA); },

    get stats() {
      return {
        strength: getStatValue(CharacterStatProp.STRENGTH),
        dexterity: getStatValue(CharacterStatProp.DEXTERITY),
        constitution: getStatValue(CharacterStatProp.CONSTITUTION),
        intelligence: getStatValue(CharacterStatProp.INTELLIGENCE),
        wisdom: getStatValue(CharacterStatProp.WISDOM),
        charisma: getStatValue(CharacterStatProp.CHARISMA)
      };
    },

    bonus: {
      get strength() { return getStatBonus(CharacterStatProp.STRENGTH); },
      get dexterity() { return getStatBonus(CharacterStatProp.DEXTERITY); },
      get constitution() { return getStatBonus(CharacterStatProp.CONSTITUTION); },
      get intelligence() { return getStatBonus(CharacterStatProp.INTELLIGENCE); },
      get wisdom() { return getStatBonus(CharacterStatProp.WISDOM); },
      get charisma() { return getStatBonus(CharacterStatProp.CHARISMA); },
    }
  };

  function getStatValue(stat) {
    return state.features[stat].value;
  }

  function getStatBonus(stat) {
    return calcStatBonus(state.features[stat].value);
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

    getModifier: (stat) => getModifier(stat),
    hasModifier: (stat) => self[stat] || canChoose(stat) ? true : false,

    getFixedStatModifier: (stat) => { return self[stat]; },
    setFixedStatModifier: (stat, value) => { self[stat] = value; },

    applyStatModifierIncrease: (stat) => applyModifierIncrease(stat),
    applyStatModifierDecrease: (stat) => applyModifierDecrease(stat),

    serialize: () => Language.deflate(self)
  };

  function canChoose(stat) {
    return self.chooseFrom === ANY || self.chooseFrom.includes(stat);
  }

  function applyModifierIncrease(stat) {
    if (self.chooseUpTo > 0 && self.choicesMade < self.chooseUpTo && canChoose(stat) && self.chosen[stat] < self.maxPerStat) {
      self.choicesMade += 1;
      self.chosen[stat] += 1;
      return true;
    }
    return false;
  }

  function applyModifierDecrease(stat) {
    if (self.chooseUpTo > 0 && self.choicesMade > 0 && canChoose(stat) && self.chosen[stat] > 0) {
      self.choicesMade -= 1;
      self.chosen[stat] -= 1;
      return true;
    }
    return false;
  }

  function getModifier(stat) {
    const available = canChoose(stat)
      && self.chooseUpTo > self.choicesMade
      && self.maxPerStat > self.chosen[stat]
      ? Math.min(self.chooseUpTo - self.choicesMade, self.maxPerStat - Math.max(self.chosen[stat], 0))
      : 0;
    return {
      source: UniqueObject(undefined, state),
      value: self[stat] + self.chosen[stat],
      min: +self[stat],
      max: +self[stat] + (canChoose(stat) && self.maxPerStat),
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
        if (feature.isBaseStat) {
          a.modifiers = [];
          a.value = 0;
          a.base = modifier.value;
          a.min = 0;
          a.max = 0;
          a.available = 0;
        }
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
      base: 0,
      min: 0,
      max: 0,
      available: 0
    });
  }
}
