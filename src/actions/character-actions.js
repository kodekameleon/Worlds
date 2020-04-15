
export function doChangeStats(character, stats) {
  const undo = {};
  let changed;
  for (const stat in stats) {
    if (character[stat] !== stats[stat]) {
      changed = true;
      undo[stat] = character[stat];
      character[stat] = stats[stat];
    }
  }

  return changed && (() => doChangeStats(character, undo));
}
