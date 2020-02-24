import {RoughPaper} from "../../view/rough-paper";
import {CharacterSheet} from "../components/character-sheet";

const character = {
  name: "Grimthorpe Firefingers",
  class: "Wizard",
  level: 3,
  background: "Sage",
  player: "Justin",
  race: "Rock Gnome",
  alignment: "Chaotic Neutral",
  xp: 600,
  strength: 15,
  dexterity: 14,
  constitution: 13,
  intelligence: 12,
  wisdom: 10,
  charisma: 8
};

export function PartiesController() {
  return (
    <div id="parties-controller" class="full-page">
      <RoughPaper class="window-backgound"/>
      <CharacterSheet character={character}/>
    </div>
  );
}
