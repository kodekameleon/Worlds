import {Language} from "../../utils";

export function ChoicesFeature(state, copyFrom) {
  const self = {
    featureChoices: []
  };
  Language.assignOverwrite(self, copyFrom);

  return {
    get featureChoices() { return self.featureChoices; }
  };
}

export function ChoicesFeatureSet(features) {
  return {
    activateFeatureChoice: (choicesFeature, choice) => { return activateFeatureChoice(choicesFeature, choice); },
    deactivateFeatureChoice: (choicesFeature) => { return deactivateFeatureChoice(choicesFeature); },
    getActiveFeatureChoice: (choicesFeature) => { return getActiveFeatureChoice(choicesFeature); }
  };

  function activateFeatureChoice(choicesFeature, choice) {
    // choiceFeature may be a string or a feature
    choicesFeature = features.getFeature(choicesFeature);
    if (choicesFeature) {
      // If there is a nother choice active, deactivate it now
      deactivateFeatureChoice(choicesFeature);

      // feature may be a string or a feature, so look it up in the ChoicesFeature
      if (typeof choice === "string") {
        choice = choicesFeature.featureChoices.find(f => f.uniqueId === choice);
      }

      // Now insert the feature after its parent
      const index = features.featureList.indexOf(choicesFeature);
      if (!features.featureList.includes(choice) && index >= 0) {
        features.featureList.splice(index + 1, 0, choice);
        return true;
      }
    }
    return false;
  }

  function deactivateFeatureChoice(choicesFeature) {
    // choiceFeature may be a string or a feature
    choicesFeature = features.getFeature(choicesFeature);
    if (choicesFeature) {
      // Go through each possible choice and remove it from the feature set, and then
      // remove its children.
      choicesFeature.featureChoices.forEach(f => {
        const index = features.featureList.indexOf(f);
        if (index >= 0) {
          features.featureList.splice(index, 1);
          deactivateFeatureChoice(f);
        }
      });
    }
  }

  function getActiveFeatureChoice(choicesFeature) {
    // choiceFeature may be a string or a feature
    choicesFeature = features.getFeature(choicesFeature);

    // Find the first choice that is included in the list, or return undefined
    return features.featureList.find(f => choicesFeature.featureChoices.includes(f));
  }
}
