
import {Abilities} from "../../model/character/ability-scores";
import {DamageProp, SkillProp} from "../../constants";

export const messages = {
  [Abilities.STRENGTH]: "Strength",
  [Abilities.DEXTERITY]: "Dexterity",
  [Abilities.CONSTITUTION]: "Constitution",
  [Abilities.INTELLIGENCE]: "Intelligence",
  [Abilities.WISDOM]: "Wisdom",
  [Abilities.CHARISMA]: "Charisma",
  short: {
    [Abilities.STRENGTH]: "STR",
    [Abilities.DEXTERITY]: "DEX",
    [Abilities.CONSTITUTION]: "CON",
    [Abilities.INTELLIGENCE]: "INT",
    [Abilities.WISDOM]: "WIS",
    [Abilities.CHARISMA]: "CHA"
  },

  [SkillProp.ACROBATICS]: "Acrobatics",
  [SkillProp.ANIMAL_HANDLING]: "Animal Handling",
  [SkillProp.ARCANA]: "Arcana",
  [SkillProp.ATHLETICS]: "Athletics",
  [SkillProp.DECEPTION]: "Deception",
  [SkillProp.HISTORY]: "History",
  [SkillProp.INSIGHT]: "Insight",
  [SkillProp.INTIMIDATION]: "Intimidation",
  [SkillProp.INVESTIGATION]: "Investigation",
  [SkillProp.MEDICINE]: "Medicine",
  [SkillProp.NATURE]: "Nature",
  [SkillProp.PERCEPTION]: "Perception",
  [SkillProp.PERFORMANCE]: "Performance",
  [SkillProp.PERSUASION]: "Persuasion",
  [SkillProp.RELIGION]: "Religion",
  [SkillProp.SLEIGHT_OF_HAND]: "Sleight of Hand",
  [SkillProp.STEALTH]: "Stealth",
  [SkillProp.SURVIVAL]: "Survival",

  [DamageProp.ACID]: "Acid",
  [DamageProp.BLUDGEONING]: "Bludgeoning",
  [DamageProp.COLD]: "Cold",
  [DamageProp.FIRE]: "Fire",
  [DamageProp.FORCE]: "Force",
  [DamageProp.LIGHTNING]: "Lightning",
  [DamageProp.NECROTIC]: "Necrotic",
  [DamageProp.PIERCING]: "Piercing",
  [DamageProp.POISON]: "Poison",
  [DamageProp.PSYCHIC]: "Psychic",
  [DamageProp.RADIANT]: "Radiant",
  [DamageProp.SLASHING]: "Slashing",
  [DamageProp.THUNDER]: "Thunder"
};
