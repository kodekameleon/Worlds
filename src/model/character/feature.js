import {Language} from "../../utils";
import {UniqueObject} from "../unique-object";
import {AbilityScoresFeature, AbilityScoresFeatureSet} from "./ability-scores";
import {ChoicesFeature, ChoicesFeatureSet} from "./choice";

export function Feature(state, copyFrom) {
  Language.compose(state, UniqueObject(state, copyFrom), AbilityScoresFeature(state, copyFrom), ChoicesFeature(state, copyFrom));
  return state;
}

export function FeatureSet() {
  const self = {
    features: []
  };

  const features = {
    get featureList() { return self.features; },

    getFeature: (featureId) => typeof featureId === "string" ? self.features.find(f => f.uniqueId === featureId) : featureId
  };

  Language.compose(features, AbilityScoresFeatureSet(features), ChoicesFeatureSet(features));

  return {
    get features() { return features; },

    getFeature: (featureId) => features.getFeature(featureId)
  };
}
