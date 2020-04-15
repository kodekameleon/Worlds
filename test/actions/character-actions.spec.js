import {doChangeStats} from "../../src/actions/character-actions";
import {expect} from "chai";

describe("Character Actions", () => {
  let model;

  beforeEach(() => {
    model = {
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8
    };
  });

  it("should make the correct changes", () => {
    doChangeStats(model, {strength: 18, dexterity: 15});

    expect(model).to.deep.equal({
      strength: 18,
      dexterity: 15,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8
    });
  });

  it("should do nothing if nothing has changed", () => {
    const res = doChangeStats(model, {strength: 15, dexterity: 14});

    expect(model).to.deep.equal({
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8
    });

    expect(res).to.equal(undefined);
  });

  it("should return a function to undo the changes", () => {
    const undo = doChangeStats(model, {strength: 18, dexterity: 15});

    expect(model).to.deep.equal({
      strength: 18,
      dexterity: 15,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8
    });

    undo();

    expect(model).to.deep.equal({
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8
    });
  });

  it("should return a function to undo the changes, and that should return a redo function", () => {
    const undo = doChangeStats(model, {strength: 18, dexterity: 15});

    expect(model).to.deep.equal({
      strength: 18,
      dexterity: 15,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8
    });

    const redo = undo();

    expect(model).to.deep.equal({
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8
    });

    redo();

    expect(model).to.deep.equal({
      strength: 18,
      dexterity: 15,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8
    });
  });
});
