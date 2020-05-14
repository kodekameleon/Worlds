
export function doChangeAbilityScores(character, featureId, abilityScores) {
  let changed;
  const undo = {};
  const feature = character.getFeature(featureId);
  if (feature) {
    for (const abilityScore in abilityScores) {
      if (feature.getFixedAbilityScoreModifier(abilityScore) !== abilityScores[abilityScore]) {
        changed = true;
        undo[abilityScore] = feature.getFixedAbilityScoreModifier(abilityScore);
        feature.setFixedAbilityScoreModifier(abilityScore, abilityScores[abilityScore]);
      }
    }
  }
  return changed && (() => doChangeAbilityScores(character, featureId, undo));
}

export function doApplyAbilityScoreModifier(character, featureId, ability, sign) {
  let changed;
  const feature = character.getFeature(featureId);
  if (feature) {
    changed = sign >= 0 ? feature.applyAbilityScoreModifierIncrease(ability) : feature.applyAbilityScoreModifierDecrease(ability);
  }
  return changed && (() => doApplyAbilityScoreModifier(character, featureId, ability, -sign));
}

export function doBuyPoint(character, featureId, ability, sign) {
  let changed;
  const feature = character.getFeature(featureId);
  if (feature) {
    changed = sign >= 0 ? feature.buyPoint(ability) : feature.sellPoint(ability);
  }
  return changed && (() => doBuyPoint(character, featureId, ability, -sign));
}

export function doActivateFeatureChoice(character, featureChoice, choice) {
  const active = character.features.getActiveFeatureChoice(featureChoice);
  if (active?.uniqueId === choice) {
    return false;
  }

  // If there is a choice, activate it, but if there is no choice deactivate the current choice
  choice
    ? character.features.activateFeatureChoice(featureChoice, choice)
    : character.features.deactivateFeatureChoice(featureChoice);

  // Return a function that will reactivate the old choice, or deactivate this choice.
  return () => doActivateFeatureChoice(character, featureChoice, active?.uniqueId);
}
