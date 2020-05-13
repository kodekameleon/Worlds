import {ANY} from "../../constants";
import {Language} from "../../utils";
import {UniqueObject} from "../unique-object";

export const Abilities = {
  STRENGTH: "strength",
  DEXTERITY: "dexterity",
  CONSTITUTION: "constitution",
  INTELLIGENCE: "intelligence",
  WISDOM: "wisdom",
  CHARISMA: "charisma"
};

const POINT_BUY_TABLE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 7, 9];

export function AbilityScores(state) {
  return {
    get strength() { return getAbilityScore(Abilities.STRENGTH); },
    get dexterity() { return getAbilityScore(Abilities.DEXTERITY); },
    get constitution() { return getAbilityScore(Abilities.CONSTITUTION); },
    get intelligence() { return getAbilityScore(Abilities.INTELLIGENCE); },
    get wisdom() { return getAbilityScore(Abilities.WISDOM); },
    get charisma() { return getAbilityScore(Abilities.CHARISMA); },

    get abilityScores() {
      return {
        strength: getAbilityScore(Abilities.STRENGTH),
        dexterity: getAbilityScore(Abilities.DEXTERITY),
        constitution: getAbilityScore(Abilities.CONSTITUTION),
        intelligence: getAbilityScore(Abilities.INTELLIGENCE),
        wisdom: getAbilityScore(Abilities.WISDOM),
        charisma: getAbilityScore(Abilities.CHARISMA)
      };
    },

    bonus: {
      get strength() { return getAbilityBonus(Abilities.STRENGTH); },
      get dexterity() { return getAbilityBonus(Abilities.DEXTERITY); },
      get constitution() { return getAbilityBonus(Abilities.CONSTITUTION); },
      get intelligence() { return getAbilityBonus(Abilities.INTELLIGENCE); },
      get wisdom() { return getAbilityBonus(Abilities.WISDOM); },
      get charisma() { return getAbilityBonus(Abilities.CHARISMA); },
    }
  };

  function getAbilityScore(ability) {
    return state.features[ability].value;
  }

  function getAbilityBonus(ability) {
    return calcAbilityBonus(state.features[ability].value);
  }

  function calcAbilityBonus(n) {
    return Math.floor((n - 10) / 2);
  }
}

export function AbilityScoresFeature(state, copyFrom) {
  const self = {
    isBaseScore: null,

    strength: null,
    dexterity: null,
    constitution: null,
    intelligence: null,
    wisdom: null,
    charisma: null,

    chooseUpTo: null,
    choicesMade: null,
    maxPerAbility: null,
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
    get strength() { return getModifier(Abilities.STRENGTH); },
    get dexterity() { return getModifier(Abilities.DEXTERITY); },
    get constitution() { return getModifier(Abilities.CONSTITUTION); },
    get intelligence() { return getModifier(Abilities.INTELLIGENCE); },
    get wisdom() { return getModifier(Abilities.WISDOM); },
    get charisma() { return getModifier(Abilities.CHARISMA); },

    get isBaseScore() { return self.isBaseScore; },

    getModifier: (ability) => getModifier(ability),
    hasModifier: (ability) => self[ability] || canChoose(ability) ? true : false,

    getFixedAbilityScoreModifier: (ability) => { return self[ability]; },
    setFixedAbilityScoreModifier: (ability, value) => { self[ability] = value; },

    applyAbilityScoreModifierIncrease: (ability) => applyModifierIncrease(ability),
    applyAbilityScoreModifierDecrease: (ability) => applyModifierDecrease(ability),

    buyPoint: (ability) => buyPoint(ability),
    sellPoint: (ability) => sellPoint(ability),
    getPointBuyCost: (ability) => getPointBuyCost(ability),
    getPointSellValue: (ability) => getPointSellValue(ability),
    getPointsRemaining: () => getPointsRemaining(),

    serialize: () => Language.deflate(self)
  };

  function canChoose(ability) {
    return self.chooseFrom === ANY || self.chooseFrom.includes(ability);
  }

  function applyModifierIncrease(ability) {
    if (self.chooseUpTo > 0 && self.choicesMade < self.chooseUpTo && canChoose(ability) && self.chosen[ability] < self.maxPerAbility) {
      self.choicesMade += 1;
      self.chosen[ability] += 1;
      return true;
    }
    return false;
  }

  function applyModifierDecrease(ability) {
    if (self.chooseUpTo > 0 && self.choicesMade > 0 && canChoose(ability) && self.chosen[ability] > 0) {
      self.choicesMade -= 1;
      self.chosen[ability] -= 1;
      return true;
    }
    return false;
  }

  function getModifier(ability) {
    const available = canChoose(ability)
      && self.chooseUpTo > self.choicesMade
      && self.maxPerAbility > self.chosen[ability]
      ? Math.min(self.chooseUpTo - self.choicesMade, self.maxPerAbility - Math.max(self.chosen[ability], 0))
      : 0;
    return {
      source: UniqueObject(undefined, state),
      value: self[ability] + self.chosen[ability],
      min: +self[ability],
      max: +self[ability] + (canChoose(ability) && self.maxPerAbility),
      available
    };
  }

  function buyPoint(ability) {
    if (getPointsRemaining() >= getPointBuyCost(ability)) {
      self[ability] += 1;
      return true;
    }
    return false;
  }

  function sellPoint(ability) {
    if (self[ability] > 8) {
      self[ability] -= 1;
      return true;
    }
    return false;
  }

  function getPointBuyCost(ability) {
    return pointCostLookup(self[ability] + 1) - pointCostLookup(self[ability]);
  }

  function getPointSellValue(ability) {
    return pointCostLookup(self[ability]) - pointCostLookup(self[ability] - 1);
  }

  function pointCostLookup(score) {
    if (score < 0) {
      return 0;
    }
    if (score >= POINT_BUY_TABLE.length) {
      return NaN;
    }
    return POINT_BUY_TABLE[score];
  }

  function getPointsRemaining() {
    const total = Object.values(Abilities).reduce((total, key) => total + pointCostLookup(self[key]), 0);
    return Number.isNaN(total) | total > 27 ? 0 : 27 - total;
  }
}

export function AbilityScoresFeatureSet(features) {
  return {
    get strength() { return getAbilityScoreModifiers(Abilities.STRENGTH); },
    get dexterity() { return getAbilityScoreModifiers(Abilities.DEXTERITY); },
    get constitution() { return getAbilityScoreModifiers(Abilities.CONSTITUTION); },
    get intelligence() { return getAbilityScoreModifiers(Abilities.INTELLIGENCE); },
    get wisdom() { return getAbilityScoreModifiers(Abilities.WISDOM); },
    get charisma() { return getAbilityScoreModifiers(Abilities.CHARISMA); },

    getAbilityScoreModifiers: (prop) => getAbilityScoreModifiers(prop)
  };

  function getAbilityScoreModifiers(prop) {
    return features.featureList.reduce((a, feature) => {
      if (feature.hasModifier(prop)) {
        const modifier = feature[prop];
        if (feature.isBaseScore) {
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
