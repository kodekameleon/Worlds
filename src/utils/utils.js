
export const Utils = {
  prefixSign: (n) => {
    return n > 0 ? `+${n}` : n;
  },

  calcStatBonus: (n) => {
    return Math.floor((n - 10) / 2);
  }
};
