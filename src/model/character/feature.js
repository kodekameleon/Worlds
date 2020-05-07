import {Language} from "../../utils";
import {UniqueObject} from "../unique-object";
import {AbilityScoresFeature, AbilityScoresFeatureSet} from "./ability-scores";

export function Feature(state, copyFrom) {
  Language.compose(state, UniqueObject(state, copyFrom), AbilityScoresFeature(state, copyFrom));
  return state;
}

export function FeatureSet() {
  const self = {
    features: []
  };

  const features = {
    get featureList() { return self.features; }
  };

  Language.compose(features, AbilityScoresFeatureSet(features));

  return {
    get features() { return features; },

    getFeature: (featureId) => self.features.find(f => f.uniqueId === featureId)
  };
}
