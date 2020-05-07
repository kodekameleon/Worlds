import {AbilityScores} from "./ability-scores";
import {FeatureSet} from "./feature";
import {Language} from "../../utils";
import {UniqueObject} from "../unique-object";

export function Character() {
  const state = {};
  return Language.compose(state, UniqueObject(state), FeatureSet(state), AbilityScores(state));
}

