import {CharacterStats} from "./character-stats";
import {Language} from "../../utils";

export function Character() {
  const state = {};

  return Language.compose(this, new CharacterStats(state));
}

