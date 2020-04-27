import {expect} from "chai";
import {svg} from "../../src/kameleon-jsx";
import {createJSX, Fragment, renderApp} from "../../src/kameleon-jsx";

function TestElement(props, children) {
  return (<span class={props.class}>{children}</span>);
}

function TestFragment(props, children) {
  return (<Fragment><span>{children}</span><span>Part 2</span></Fragment>);
}

function TestNestedCustom(props, children) {
  return (<div><TestElement>{children}</TestElement></div>);
}

function TestElementFuncClass() {
  TestElementFuncClass.prototype.render = (props) => {
    return <div props={props}/>;
  };
}

class TestElementClass {
  constructor() {
  }

  render(props) {
    return <div props={props}/>;
  }
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

  it("should create an element with a custom property", () => {
    const el = (<div custom-prop="a-custom-prop"/>);
    expect(el.outerHTML).to.equal("<div custom-prop=\"a-custom-prop\"></div>");
  });

  it("should create an element ignoring undefined custom properties", () => {
    const el = (<div custom-prop={undefined}/>);
    expect(el.outerHTML).to.equal("<div></div>");
  });

  it("should create an element with delegated props using class", () => {
    const el = (<div props={{class: "abc"}}>Hello World!</div>);
    expect(el.outerHTML).to.equal("<div class=\"abc\">Hello World!</div>");
  });

  it("should create an element with delegated props using className", () => {
    const el = (<div props={{className: "abc"}}>Hello World!</div>);
    expect(el.outerHTML).to.equal("<div class=\"abc\">Hello World!</div>");
  });

  it("should create an element with class delegated props overridden by parameterized props", () => {
    const el = (<div className="def" props={{class: "abc"}}>Hello World!</div>);
    expect(el.outerHTML).to.equal("<div class=\"def\">Hello World!</div>");
  });

  it("should create an element ignoring custom delegated props", () => {
    const el = (<div props={{"custom-prop": "abc"}}>Hello World!</div>);
    expect(el.outerHTML).to.equal("<div>Hello World!</div>");
  });

  it("should create an element with custom delegated props overridden by parameterized props", () => {
    const el = (<div custom-prop="def" props={{"custom-prop": "abc"}}>Hello World!</div>);
    expect(el.outerHTML).to.equal("<div custom-prop=\"def\">Hello World!</div>");
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
    const el = (<div className={["a", "", undefined, null, false, "b", "c"]}/>);
    expect(el.outerHTML).to.equal("<div class=\"a b c\"></div>");
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
    function TestElementNoProps(props, children) {
      expect(props).to.deep.equal({});
      return (<span class={props.class}>{children}</span>);
    }

    const el = (<TestElementNoProps>Hello World!</TestElementNoProps>);
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

  it("should create a reference to an element with a ref", () => {
    const ref = {};
    const el = (<div ref={ref}/>);
    expect(el).to.equal(ref?.element);
    expect(el.outerHTML).to.equal(<div/>.outerHTML);
  });

  it("should fail when creating an element with an undefined reference", () => {
    let ref;
    expect(() => (<div ref={ref}/>)).throw("References must be initialized when creating elements with a reference");
  });

  it("should create a custom element from a functional class", () => {
    const el = (<TestElementFuncClass class={"blah"}/>);
    expect(el.outerHTML).to.equal("<div class=\"blah\"></div>");
  });

  it("should create a custom element from a functional class with a ref", () => {
    const ref = {};
    const el = (<TestElementFuncClass class={"blah"} ref={ref}/>);
    expect(el.outerHTML).to.equal("<div class=\"blah\"></div>");
    expect(ref.element).to.equal(el);
    expect(ref.object).to.not.be.null;
    expect(ref.object.constructor.name).to.equal("TestElementFuncClass");
  });

  it("should create a custom element from a class", () => {
    const ref = {};
    const el = (<TestElementClass class={"blah"} ref={ref}/>);
    expect(el.outerHTML).to.equal("<div class=\"blah\"></div>");
    expect(ref.element).to.equal(el);
    expect(ref.object).to.not.be.null;
    expect(ref.object.constructor.name).to.equal("TestElementClass");
  });

  it("should fail with an invalid element type", () => {
    expect(() => createJSX(27)).to.throw("JSX element must be a string for a standard element or a function");
  });

  it("should ignore undefined, null, false elements", () => {
    const el = (<div>{[undefined, null, false]}</div>);
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

