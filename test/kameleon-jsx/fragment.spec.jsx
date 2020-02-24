import {expect} from "chai";

import {Fragment} from "../../src/kameleon-jsx/fragment.jsx";

describe("Fragment element:", () => {
  it("should ignore a fragment", () => {
    const el = (<div><Fragment><span>Hello World!</span><span>Part 2</span></Fragment></div>);
    expect(el.outerHTML).to.equal("<div><span>Hello World!</span><span>Part 2</span></div>");
  });
  it("should ignore a short form fragment", () => {
    const el = (<div><><span>Hello World!</span><span>Part 2</span></></div>);
    expect(el.outerHTML).to.equal("<div><span>Hello World!</span><span>Part 2</span></div>");
  });
});
