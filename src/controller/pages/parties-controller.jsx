import {Character} from "../../model";
import {CharacterSheet} from "../components/character-sheet";
import {Feature} from "../../model/character/feature";
import {FeatureIds} from "../../constants";
import {RoughPaper} from "../../view/rough-paper";
import "./parties-controller.css";

const character = Character();
character.name = "Grimthorpe Firefingers";
character.class = "Wizard";
character.level = 5;
character.background = "Sage";
character.player = "Justin";
character.race = "Rock Gnome";
character.alignment = "Chaotic Neutral";
character.xp = 600;

const standardArrayFeature = Feature({}, {
  uniqueId: FeatureIds.STANDARD_ARRAY,
  name: "Standard Scores",
  isBaseScore: true,
  strength: 15,
  dexterity: 14,
  constitution: 13,
  intelligence: 12,
  wisdom: 10,
  charisma: 8
});

const pointsBuyFeature = Feature({}, {
  uniqueId: FeatureIds.POINTS_BUY,
  name: "Points Buy",
  isBaseScore: true,
  strength: 8,
  dexterity: 8,
  constitution: 8,
  intelligence: 8,
  wisdom: 8,
  charisma: 8
});

const dieRollFeature = Feature({}, {
  uniqueId: FeatureIds.RANDOM,
  name: "Dice Roll",
  isBaseScore: true,
  strength: 8,
  dexterity: 8,
  constitution: 8,
  intelligence: 8,
  wisdom: 8,
  charisma: 8
});

const manualScoresFeature = Feature({}, {
  uniqueId: FeatureIds.MANUAL,
  name: "Manual Entry",
  isBaseScore: true,
  strength: 8,
  dexterity: 8,
  constitution: 8,
  intelligence: 8,
  wisdom: 8,
  charisma: 8
});

const baseAbilityScoresFeature = Feature({}, {
  uniqueId: FeatureIds.BASE_ABILITY_SCORES_CHOICES,
  name: "Ability scores options",
  featureChoices: [standardArrayFeature, pointsBuyFeature, dieRollFeature, manualScoresFeature]
});

const halfElfFeature = Feature({}, {
  uniqueId: "race:half-elf",
  name: "Half Elf",
  charisma: 2,
  chooseUpTo: 2,
  choicesMade: 2,
  maxPerAbility: 1,
  chooseFrom: ["strength", "dexterity", "constitution", "intelligence", "wisdom"],
  chosen: {
    constitution: 1,
    intelligence: 1
  }
});
const level4Feature = Feature({}, {
  uniqueId: "class:wizard-level-4",
  name: "Wizard Level 4",
  chooseUpTo: 2,
  maxPerAbility: 1,
  chooseFrom: ["strength", "dexterity", "intelligence", "wisdom", "charisma"]
});

character.features.featureList.push(baseAbilityScoresFeature, halfElfFeature, level4Feature);


console.log(character);
console.log(standardArrayFeature);
console.log(halfElfFeature);

export function PartiesController() {
  return (
    <div id="parties-controller" class="full-page">
      <RoughPaper class="window-backgound"/>
      <CharacterSheet character={character}/>
    </div>
  );
}
