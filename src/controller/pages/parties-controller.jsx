import {Character} from "../../model";
import {CharacterSheet} from "../components/character-sheet";
import {Feature} from "../../model/character/feature";
import {RoughPaper} from "../../view/rough-paper";
import "./parties-controller.css";

const character = Character();
character.name = "Grimthorpe Firefingers";
character.class = "Wizard";
character.level = 3;
character.background = "Sage";
character.player = "Justin";
character.race = "Rock Gnome";
character.alignment = "Chaotic Neutral";
character.xp = 600;
character.strength = 15;
character.dexterity = 14;
character.constitution = 13;
character.intelligence = 12;
character.wisdom = 10;
character.charisma = 8;

// Create base stats and Half Elf features
const standardArrayFeature = Feature({}, {
  uniqueId: "base-stats:standard-array",
  name: "Standard Array",

  strength: 15,
  dexterity: 14,
  constitution: 13,
  intelligence: 12,
  wisdom: 10,
  charisma: 8
});
const halfElfFeature = Feature({}, {
  uniqueId: "race:half-elf",
  name: "Half Elf",
  charisma: 2,
  chooseUpTo: 2,
  maxPerStat: 1,
  chooseFrom: ["strength", "dexterity", "intelligence", "wisdom"],
  chosen: {
    constitution: 1,
    intelligence: 1
  }
});

character.features.featureList.push(standardArrayFeature, halfElfFeature);


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
