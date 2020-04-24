import {expect} from "chai";

import {Language} from "../../src/utils";

describe("Language namespace", () => {
  describe("Composition", () => {
    it("should do nothing when there is nothing to compose", () => {
      const o = Language.compose({});

      expect(o).to.deep.equal({});
    });

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

  describe("Deflation", () => {
    it("should deflate an empty list", () => {
      expect(Language.deflate({field: []})).to.deep.equal({});
    });

    it("should not deflate a non-empty list", () => {
      expect(Language.deflate({field: [1, 2, 3]})).to.deep.equal({field: [1, 2, 3]});
    });

    it("should remove null fields", () => {
      expect(Language.deflate({field: null})).to.deep.equal({});
    });

    it("should not remove non-null fields", () => {
      expect(Language.deflate({field: 2})).to.deep.equal({field: 2});
    });

    it("should perform deep deflation", () => {
      expect(Language.deflate({child: {field: null}})).to.deep.equal({});
    });

    it("should perform deep deflation with children being non-empty", () => {
      expect(Language.deflate({child: {field: null, keep: 1}})).to.deep.equal({child: {keep: 1}});
    });

    it("should perform deep deflation on non-trivial examples", () => {
      expect(Language.deflate({child: {field: null, keep: 1}, emptyList: [], nullList: [null]})).to.deep.equal({child: {keep: 1}, nullList: [null]});
    });

    it("should handle prototype members", () => {
      const obj = {childValue: 14, value: 27, ignored: null};
      Object.prototype.q = 99;

      expect(Language.deflate(obj)).to.deep.equal({childValue: 14, value: 27});
    });
  });

  describe("Assign overwrite existing", () => {
    it("should do nothing if the source is undefined", () => {
      const target = {a: null, b: null};
      const result = Language.assignOverwrite(target, undefined);
      expect(result).to.deep.equal({a: null, b: null});
    });

    it("should overwrite existing fields, and ignore fields not in the target", () => {
      const target = {a: null, b: null};
      const result = Language.assignOverwrite(target, {a: 5, c: 10});
      expect(result).to.deep.equal({a: 5, b: null});
    });

    it("should overwrite existing fields, without overwriting objects in the target that are not objects in the source", () => {
      const target = {a: null, b: null, c: {c1: null, c2: null}};
      const result = Language.assignOverwrite(target, {a: 5, c: 10});
      expect(result).to.deep.equal({a: 5, b: null, c: {c1: null, c2: null}});
    });

    it("should overwrite subobjects correctly", () => {
      const target = {a: null, b: null, c: {c1: null, c2: null}};
      const result = Language.assignOverwrite(target, {a: 5, c: {c1: 25, c3: 43}});
      expect(result).to.deep.equal({a: 5, b: null, c: {c1: 25, c2: null}});
    });
  });
});
