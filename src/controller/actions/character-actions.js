
export function doChangeStats(character, featureId, stats) {
  let changed;
  const undo = {};
  const feature = character.getFeature(featureId);
  if (feature) {
    for (const stat in stats) {
      if (feature.getFixedStatModifier(stat) !== stats[stat]) {
        changed = true;
        undo[stat] = feature.getFixedStatModifier(stat);
        feature.setFixedStatModifier(stat, stats[stat]);
      }
    }
  }
  return changed && (() => doChangeStats(character, featureId, undo));
}

export function doApplyStatMod(character, featureId, stat, sign) {
  let changed;
  const feature = character.getFeature(featureId);
  if (feature) {
    changed = sign >= 0 ? feature.applyStatModifierIncrease(stat) : feature.applyStatModifierDecrease(stat);
  }
  return changed && (() => doApplyStatMod(character, featureId, stat, -sign));
}
