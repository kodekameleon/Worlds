import {expect} from "chai";
import {UniqueObject} from "../../src/model/unique-object";

describe("UniqueObject", () => {
  it("should copy a plain object", () => {
    const ob = UniqueObject({}, {uniqueId: "id", name: "name"});
    expect(ob).to.deep.equal({uniqueId: "id", name: "name"});
  });

  it("should allow the name to be assigned", () => {
    const ob = UniqueObject({});
    ob.name = "hello";
    expect(ob).to.deep.equal({uniqueId: null, name: "hello"});
  });
});
