import {expect} from "chai";
import {NavItem, NavList} from "../../src/widgets";

describe("NavList element", () => {
  it("should render an ordered list", () => {
    const navlist = (<NavList/>);
    expect(navlist.tagName).to.equal("OL");
  });

  it("should have a well known class name", () => {
    const navlist = (<NavList/>);
    expect(navlist.className).to.equal("navlist");
  });

  it("should render child elements correctly", () => {
    const navlist = (<NavList><div>A</div><div>B</div></NavList>);
    expect(navlist.innerHTML).to.equal("<div>A</div><div>B</div>");
  });
});

describe("NavItem element", () => {
  beforeEach(() => {
    // reset the document before each test
    document.body.innerHTML = "";
    window.location.hash = "#";
  });

  it("should render a list item", () => {
    const navlist = (<NavItem href={"#"}/>);
    expect(navlist.tagName).to.equal("LI");
  });

  it("should require an href and fail if one is not provided", () => {
    expect(() => {(<NavItem/>);}).to.throw("Missing href for nav item");
  });

  it("should render an anchor with the correct href", () => {
    const navitem = (<NavItem href={"#test"}>link</NavItem>);
    document.body.append(navitem);
    expect(document.querySelector("li a")).to.not.be.null;
    expect(document.querySelector("li a").getAttribute("href")).to.equal("#test");
  });

  it("should render item text in a span element", () => {
    const navitem = (<NavItem href={"#"}>link</NavItem>);
    document.body.append(navitem);
    expect(document.querySelector("li span")).to.not.be.null;
    expect(document.querySelector("li span").outerHTML).to.equal("<span>link</span>");
  });

  it("should have a css class 'selected' when the href matches the window location", () => {
    window.location.hash = "#hash";
    const navitem = (<NavItem href={"#hash"}>link</NavItem>);
    document.body.append(navitem);
    expect(document.querySelector("li.selected")).to.not.be.null;
    expect(document.querySelector("li.selected").tagName).to.equal("LI");
  });

  it("should have a css class 'selected' when the href and window location are both '#'", () => {
    window.location.hash = "#";
    const navitem = (<NavItem href={"#"}>link</NavItem>);
    document.body.append(navitem);
    expect(document.querySelector("li.selected")).to.not.be.null;
    expect(document.querySelector("li.selected").tagName).to.equal("LI");
  });

  it("should not have a css class 'selected' when the href does not match the window location", () => {
    window.location.hash = "#hash";
    const navitem = (<NavItem href={"#fred"}>link</NavItem>);
    document.body.append(navitem);
    expect(document.querySelector("li.selected")).to.be.null;
  });

  it("should not have a css class 'selected' when the href is outside of the app", () => {
    window.location.hash = "#hash";
    const navitem = (<NavItem href={"/blah"}>link</NavItem>);
    document.body.append(navitem);
    expect(document.querySelector("li.selected")).to.be.null;
  });
});
