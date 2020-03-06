
export const Utils = {
  signed: (n) => {
    return n > 0 ? `+${n}` : `${n}`;
  },

  calcStatBonus: (n) => {
    return Math.floor((n - 10) / 2);
  }
};
