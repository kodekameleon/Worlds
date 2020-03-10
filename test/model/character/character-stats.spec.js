import {expect} from "chai";

import {CharacterStats} from "../../../src/model";

describe("CharacterStats", () => {
  it("should set and get values", () => {
    const stats = CharacterStats();
    stats.strength = 5;
    stats.dexterity = 7;
    stats.constitution = 9;
    stats.intelligence = 11;
    stats.wisdom = 13;
    stats.charisma = 15;

    expect(stats.strength).to.equal(5);
    expect(stats.dexterity).to.equal(7);
    expect(stats.constitution).to.equal(9);
    expect(stats.intelligence).to.equal(11);
    expect(stats.wisdom).to.equal(13);
    expect(stats.charisma).to.equal(15);
  });

  it("should calculate bonuses correctly", () => {
    const stats = CharacterStats();
    stats.strength = 5;
    stats.dexterity = 6;
    stats.constitution = 9;
    stats.intelligence = 11;
    stats.wisdom = 13;
    stats.charisma = 16;

    expect(stats.bonus.strength).to.equal(-3);
    expect(stats.bonus.dexterity).to.equal(-2);
    expect(stats.bonus.constitution).to.equal(-1);
    expect(stats.bonus.intelligence).to.equal(0);
    expect(stats.bonus.wisdom).to.equal(1);
    expect(stats.bonus.charisma).to.equal(3);

  });
});
