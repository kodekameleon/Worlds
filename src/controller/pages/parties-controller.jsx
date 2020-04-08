import {RoughPaper} from "../../view/rough-paper";
import {CharacterSheet} from "../components/character-sheet";
import {Character} from "../../model";

import "./parties-controller.css";

const character = new Character();
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

export function PartiesController() {
  return (
    <div id="parties-controller" class="full-page">
      <RoughPaper class="window-backgound"/>
      <CharacterSheet character={character}/>
    </div>
  );
}
