
export const Utils = {
  signed: (n) => {
    return n > 0 ? `+${n}` : `${n}`;
  },

  rollDice: (text) => {
    // Parse the text with a regex
    const parsed = /^\s*(?:(\d+)\/)?\s*(\d+)?\s*d\s*(\d+)\s*(?:(?:\+\s*(\d+))|(?:-\s*(\d+)))?$/.exec(text);
    if (!parsed) {
      return;
    }

    // Get the bits out of the regex
    const take = parsed[1];
    const roll = parsed[2];
    const sides = parsed[3];
    const plus = parsed[4] || 0;
    const minus = parsed[5] || 0;

    // Roll the dice
    let total = 0;
    const dice = [];
    for (let i = 0; i < roll; ++i) {
      const random = Math.floor(Math.random() * sides) + 1;
      total += random;
      dice.push(random);
    }

    // If we are taking a subset, sort the array, then take the highest rolls
    if (take && take < roll) {
      dice.sort((a, b) => b - a);
      dice.splice(take, roll - take);
      total = dice.reduce((a, v) => a + v, 0);
    }

    // Add the modifiers
    total = total + +plus - +minus;

    return {total, dice};
  }
};
