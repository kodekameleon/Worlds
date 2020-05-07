
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
