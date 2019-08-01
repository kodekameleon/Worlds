import {expect} from "chai";

import {Logo} from "../../src/widgets";

// There really isn't much to test with the logo, it's just a chunk of HTML. Basically, we just test that
// it renders HTML.
describe("Logo tests", () => {
  it("should render the logo", () => {
    const logo = (<Logo/>);
    expect(logo.tagName).to.equal("DIV");
  });
});
