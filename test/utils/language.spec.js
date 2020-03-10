import {expect} from "chai";

import {Language} from "../../src/utils";

describe("Language namespace", () => {
  describe("Composition", () => {
    it("should compose all of the objects", () => {
      const o = Language.compose({}, {a: "a"}, {b: "b"});

      expect(o).to.deep.equal({a: "a", b: "b"});
    });

    it("should overwrite previous properties with later properties", () => {
      const o = Language.compose({}, {a: "a"}, {b: "b"}, {a: "aaa"});

      expect(o).to.deep.equal({a: "aaa", b: "b"});
    });

    it("should copy getters and setters without resolving them", () => {
      let theValue = 12;

      const o = Language.compose({}, {
        get value() { return theValue; },
        set value(v) { theValue = v; }
      });

      expect(o.value).to.equal(12);

      o.value = 16;
      expect(theValue).to.equal(16);
      expect(o.value).to.equal(16);
    });
  });
});
