import {expect} from "chai";

import {Fragment, createJSX, renderApp} from "../../src/kameleon-jsx";
import {svg} from "../../src/kameleon-jsx";

function TestElement(props, children) {
  return (<span class={props.class}>{children}</span>);
}

function TestFragment(props, children) {
  return (<Fragment><span>{children}</span><span>Part 2</span></Fragment>);
}

function TestNestedCustom(props, children) {
  return (<div><TestElement>{children}</TestElement></div>);
}

function TestElementNoProps(props, children) {
  expect(props).to.deep.equal({});
  return (<span class={props.class}>{children}</span>);
}

describe("CreateJSX:", () => {
  it("should create a simple div element", () => {
    const el = (<div/>);
    expect(el.tagName).to.equal("DIV");
  });

  it("should create an element with a namespace", () => {
    const el = (<svg:path/>);
    expect(el.tagName).to.equal("path");
    expect(el.namespaceURI).to.equal("http://www.w3.org/2000/svg");
  });

  it("should create an element with a class name in the 'class' property", () => {
    const el = (<div class="a-class-name"/>);
    expect(el.className).to.equal("a-class-name");
  });

  it("should create an element with a class name in the 'className' property", () => {
    const el = (<div className="a-class-name"/>);
    expect(el.className).to.equal("a-class-name");
  });

  it("should create an element with classes that are a string", () => {
    const el = (<div className={"a b c"}/>);
    expect(el.outerHTML).to.equal("<div class=\"a b c\"></div>");
  });

  it("should create an element with classes that are an empty string", () => {
    const el = (<div className={""}/>);
    expect(el.outerHTML).to.equal("<div></div>");
  });

  it("should create an element with classes in an array", () => {
    const el = (<div className={["a", "", undefined, null, "b", "c"]}/>);
    expect(el.outerHTML).to.equal("<div class=\"a b c\"></div>");
  });

  it("should create an element with an 'addClass' string", () => {
    const el = (<div addClass="a-class-name"/>);
    expect(el.className).to.equal("a-class-name");
  });

  it("should create an element with an 'addClass' array", () => {
    const el = (<div addClass={["a", "", undefined, null, "b", "c"]}/>);
    expect(el.className).to.equal("a b c");
  });

  it("should fail to create an element with an invalid tag", () => {
    expect(() => createJSX(" ")).to.throw();
  });

  it("should create an element with inline styles in an object", () => {
    const el = (<div style={"display: none"}/>);
    expect(el.style.cssText).to.deep.equal("display: none;");
  });

  it("should create an element with inline styles in a string", () => {
    const el = (<div style={{display: "none"}}/>);
    expect(el.style.cssText).to.deep.equal("display: none;");
  });

  it("should create an element with an event handler", () => {
    let funcCalled = false;
    function func() { funcCalled = true; }
    const el = (<div on:hello={func}/>);
    el.dispatchEvent(new Event("hello"));
    expect(funcCalled).to.equal(true);
  });

  it("should create an element with a callback", () => {
    let called = false;
    const el = (<div>{() => {called = true; return "abc";}}</div>);
    expect(el.tagName).to.equal("DIV");
    expect(el.innerHTML).to.equal("abc");
    expect(called).to.equal(true);
  });

  it("should create a custom element", () => {
    const el = (<TestElement class="cls">Hello World!</TestElement>);
    expect(el.outerHTML).to.equal("<span class=\"cls\">Hello World!</span>");
  });

  it("should create a custom element ensuring props is defined", () => {
    const el = (<TestElementNoProps>Hello World!</TestElementNoProps>);
    expect(el.outerHTML).to.equal("<span>Hello World!</span>");
  });

  it("should fail when creating a custom element with addClass", () => {
    expect(() => (<TestElement addClass={"abc"}>Hello World!</TestElement>))
      .to.throw("May not specify addClass or add-class when creating a custom element");
    expect(() => (<TestElement add-class={"abc"}>Hello World!</TestElement>))
      .to.throw("May not specify addClass or add-class when creating a custom element");
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

  it("should render the app", () => {
    document.documentElement.innerHTML = "<div id='root'>OLD STUFF</div>";
    renderApp(<span/>);
    expect(document.documentElement.innerHTML).to.equal("<head></head><body><div id=\"root\"><span></span></div></body>");
  });

  it("should fail to render the app if there is no root element", () => {
    document.documentElement.innerHTML = "<div>OLD STUFF</div>";
    expect(() => renderApp(<span/>))
      .to.throw("To render the application there must be an element with the id #root in the document");
  });
});

