
import {Language} from "../../utils";
import {CharacterStats} from "./character-stats";

export function Character() {
  const state = {};

  return Language.compose(this, new CharacterStats(state));
}

