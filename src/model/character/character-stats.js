
export function CharacterStats() {
  const self = {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10
  };

  return {
    get strength() { return self.strength; },
    set strength(v) { self.strength = v; },
    get dexterity() { return self.dexterity; },
    set dexterity(v) { self.dexterity = v; },
    get constitution() { return self.constitution; },
    set constitution(v) { self.constitution = v; },
    get intelligence() { return self.intelligence; },
    set intelligence(v) { self.intelligence = v; },
    get wisdom() { return self.wisdom; },
    set wisdom(v) { self.wisdom = v; },
    get charisma() { return self.charisma; },
    set charisma(v) { self.charisma = v; },

    bonus: {
      get strength() { return calcStatBonus(self.strength); },
      get dexterity() { return calcStatBonus(self.dexterity); },
      get constitution() { return calcStatBonus(self.constitution); },
      get intelligence() { return calcStatBonus(self.intelligence); },
      get wisdom() { return calcStatBonus(self.wisdom); },
      get charisma() { return calcStatBonus(self.charisma); },
    }
  };
}

function calcStatBonus(n) {
  return Math.floor((n - 10) / 2);
}

