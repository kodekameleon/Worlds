import {expect} from "chai";

import {Fragment, createJSX} from "../../src/kameleon-jsx";

function TestElement(props, children) {
  return (<span>{children}</span>);
}

function TestFragment(props, children) {
  return (<Fragment><span>{children}</span><span>Part 2</span></Fragment>);
}

function TestNestedCustom(props, children) {
  return (<div><TestElement>{children}</TestElement></div>);
}

describe("CreateJSX feature:", () => {
  it("should create a simple div element", () => {
    const el = (<div/>);
    expect(el.tagName).to.equal("DIV");
  });

  it("should create an element with a class name in the 'class' property", () => {
    const el = (<div class="a-class-name"/>);
    expect(el.className).to.equal("a-class-name");
  });

  it("should create an element with a class name in the 'className' property", () => {
    const el = (<div className="a-class-name"/>);
    expect(el.className).to.equal("a-class-name");
  });

  it("should fail to create an element with an invalid tag", () => {
    expect(() => createJSX(" ")).to.throw();
  });

  it("should create an element with inline styles", () => {
    const el = (<div style={{display: "none"}}/>);
    expect(el.style.cssText).to.deep.equal("display: none;");
  });

  it("should create an element with a callback", () => {
    let called = false;
    const el = (<div>{() => {called = true; return "abc";}}</div>);
    expect(el.tagName).to.equal("DIV");
    expect(el.innerHTML).to.equal("abc");
    expect(called).to.equal(true);
  });

  it("should create a custom element", () => {
    const el = (<TestElement>Hello World!</TestElement>);
    expect(el.outerHTML).to.equal("<span>Hello World!</span>");
  });

  it("should create a custom element containing a fragment", () => {
    const el = (<div><TestFragment>Hello World!</TestFragment></div>);
    expect(el.outerHTML).to.equal("<div><span>Hello World!</span><span>Part 2</span></div>");
  });

  it("should create a custom element with nested children", () => {
    const el = (<TestNestedCustom>Hello World!</TestNestedCustom>);
    expect(el.outerHTML).to.equal("<div><span>Hello World!</span></div>");
  });

  it("should fail with an invalid element type", () => {
    expect(() => createJSX(27)).to.throw("JSX element must be a string for a standard element or a function");
  });

  it("should ignore undefined elements", () => {
    const el = (<div>{undefined}</div>);
    expect(el.outerHTML).to.equal("<div></div>");
  });
});

