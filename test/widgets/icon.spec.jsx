import {expect} from "chai";
import {Icon} from "../../src/widgets";

describe("Icon tests", () => {
  it("should render the icon", () => {
    const icon = (<Icon/>);
    expect(icon.outerHTML).to.equal("<div class=\"icon\"></div>");
  });

  it("should render the glyph", () => {
    const icon = (<Icon glyph="&#xe003;"/>);
    expect(icon.outerHTML).to.equal("<div class=\"icon\" glyph=\"\uE003\"></div>");
  });

  it("should render the hover effect", () => {
    const icon = (<Icon hoverEffect="crescent-moon"/>);
    expect(icon.outerHTML).to.equal("<div class=\"icon crescent-moon\"></div>");
  });

  it("should render the popup tip", () => {
    const icon = (<Icon tip="This is a popup tip"/>);
    expect(icon.outerHTML).to.have.string("This is a popup tip");
  });

  it("should render neither enabled nor disabled", () => {
    const icon = (<Icon/>);
    expect(icon.outerHTML).to.equal("<div class=\"icon\"></div>");
  });

  it("should render enabled", () => {
    const icon = (<Icon enabled/>);
    expect(icon.outerHTML).to.equal("<div class=\"icon enabled\"></div>");
  });

  it("should render disabled", () => {
    const icon = (<Icon enabled={false}/>);
    expect(icon.outerHTML).to.equal("<div class=\"icon disabled\"></div>");
  });
});
