import {expect} from "chai";

import {Router} from "../../src/kameleon-jsx/routing";

describe("Router component:", () => {
  let oldAddListener, oldRemoveListener;
  let listeners = [];
  let removedListeners = [];

  before(() => {
    // Override the event listener methods on the window so we can track listeners
    oldAddListener = document.addEventListener;
    window.addEventListener = function() {
      oldAddListener.apply(this, arguments);
      listeners.push(arguments);
    };

    oldRemoveListener = document.removeEventListener;
    window.removeEventListener = function() {
      oldRemoveListener.apply(this, arguments);
      removedListeners.push(arguments[1]);
    };
  });

  beforeEach(() => {
    // reset the document before each test
    document.body.innerHTML = "";
    window.location.hash = "#";
    removedListeners = [];
  });

  afterEach(() => {
    // Clear all of the listeners
    listeners.forEach((v) => window.removeEventListener(...v));
    listeners = [];
  });

  after(() => {
    document.addEventListener = oldAddListener;
    document.removeEventListener = oldRemoveListener;
  });

  it("should create a basic route", () => {
    const el = (<div><Router hash="hash">Hello World!</Router></div>);
    expect(el.outerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");
  });

  it("should render as expected when added to the DOM", () => {
    const el = (<div><Router hash="hash">Hello World!</Router></div>);
    document.body.appendChild(el);
    expect(document.body.innerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");
  });

  it("should require a hash and fail if one is not provided", () => {
    expect(() => (<Router xyz={""}/>)).to.throw("Router element requires a hash attribute");
    expect(() => (<Router/>)).to.throw("Router element requires a hash attribute");
  });

  it("should render text as is", () => {
    const el = (<div><Router hash={"hash"} always>Hello World!</Router></div>);
    expect(el.outerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "Hello World!" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");
  });

  it("should render child elements as is", () => {
    const el = (
      <div><Router hash={"hash"} always>
        <div>Hello World!</div>
      </Router></div>);
    expect(el.outerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "<div>Hello World!</div>" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");
  });

  it("should render when any hash matches", () => {
    window.location.hash = "#hash1";
    let el = (<div><Router hash={["hash1", "hash2"]}>Hello World!</Router></div>);
    expect(el.outerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "Hello World!" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");

    window.location.hash = "#hash2";
    el = (<div><Router hash={["hash1", "hash2"]}>Hello World!</Router></div>);
    expect(el.outerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "Hello World!" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");
  });

  it("should render when any hash matches after route changes", (done) => {
    // It should first render without the text, then render it after the route changes to match
    window.location.hash = "#";
    const el = (<div><Router hash={["hash1", "hash2"]}>Hello World!</Router></div>);
    document.body.appendChild(el);
    expect(document.body.innerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");

    // Wait until the location change event has been fired, then check whether the elements are still present.
    window.addEventListener("hashchange", function () {
      setImmediate(() => {
        expect(document.body.innerHTML).to.equal(
          "<div>" +
          "<div class=\"router\" style=\"display: none;\"></div>" +
          "Hello World!" +
          "<div class=\"router-end\" style=\"display: none;\"></div>" +
          "</div>");
        done();
      });
    }, {once: true});

    // Now change the URL to trigger the event
    window.location.hash = "#hash1";
  });

  it("should not render when no hash matches", () => {
    window.location.hash = "#";
    let el = (<div><Router hash={["hash1", "hash2"]}>Hello World!</Router></div>);
    expect(el.outerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");

    window.location.hash = "#other";
    el = (<div><Router hash={["hash1", "hash2"]}>Hello World!</Router></div>);
    expect(el.outerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");
  });

  it("should not render when no hash matches after route changes", (done) => {
    // It should first render without the text, then render it after the route changes to match
    window.location.hash = "#hash1";
    const el = (<div><Router hash={["hash1", "hash2"]}>Hello World!</Router></div>);
    document.body.appendChild(el);
    expect(document.body.innerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "Hello World!" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");

    // Wait until the location change event has been fired, then check whether the elements are still present.
    window.addEventListener("hashchange", function () {
      setImmediate(() => {
        expect(document.body.innerHTML).to.equal(
          "<div>" +
          "<div class=\"router\" style=\"display: none;\"></div>" +
          "<div class=\"router-end\" style=\"display: none;\"></div>" +
          "</div>");
        done();
      });
    }, {once: true});

    // Now change the URL to trigger the event
    window.location.hash = "#";
  });

  it("should always render with the always attribute", () => {
    const el = (<div><Router hash={"hash"} always>Hello World!</Router></div>);
    expect(el.outerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "Hello World!" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");
  });

  it("should always render with the always attribute after route changes", (done) => {
    const el = (<div><Router hash={"hash"} always>Hello World!</Router></div>);
    document.body.appendChild(el);

    // Wait until the location change event has been fired, then check whether the elements are still present.
    window.addEventListener("hashchange", () => {
      setImmediate(() => {
        expect(document.body.innerHTML).to.equal(
          "<div>" +
          "<div class=\"router\" style=\"display: none;\"></div>" +
          "Hello World!" +
          "<div class=\"router-end\" style=\"display: none;\"></div>" +
          "</div>");
        done();
      });
    }, {once: true});

    // Now change the URL to trigger the event
    window.location.hash = "#other";
  });

  it("should render when no hash matches when the none attribute is given", () => {
    const el = (<div><Router hash={["hash1", "hash2"]} none>Hello World!</Router></div>);
    expect(el.outerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "Hello World!" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");
  });

  it("should render when no hash matches when the none attribute is given after route changes", (done) => {
    // It should first render without the text, then render it after the route changes to match
    window.location.hash = "#hash1";
    const el = (<div><Router hash={["hash1", "hash2"]} none>Hello World!</Router></div>);
    document.body.appendChild(el);
    expect(document.body.innerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");

    // Wait until the location change event has been fired, then check whether the elements are still present.
    window.addEventListener("hashchange", function () {
      setImmediate(() => {
        expect(document.body.innerHTML).to.equal(
          "<div>" +
          "<div class=\"router\" style=\"display: none;\"></div>" +
          "Hello World!" +
          "<div class=\"router-end\" style=\"display: none;\"></div>" +
          "</div>");
        done();
      });
    }, {once: true});

    // Now change the URL to trigger the event
    window.location.hash = "#";
  });

  it("should not render when any hash matches when the none attribute is given", () => {
    window.location.hash = "#hash1";
    let el = (<div><Router hash={["hash1", "hash2"]} none>Hello World!</Router></div>);
    expect(el.outerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");

    window.location.hash = "#hash2";
    el = (<div><Router hash={["hash1", "hash2"]} none>Hello World!</Router></div>);
    expect(el.outerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");
  });

  it("should not render when any hash matches when the none attribute is given after route changes", (done) => {
    // It should first render with the text, then render it after the route changes to match
    window.location.hash = "#";
    const el = (<div><Router hash={["hash1", "hash2"]} none>Hello World!</Router></div>);
    document.body.appendChild(el);
    expect(document.body.innerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "Hello World!" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");

    // Wait until the location change event has been fired, then check whether the elements are still present.
    window.addEventListener("hashchange", function () {
      setImmediate(() => {
        expect(document.body.innerHTML).to.equal(
          "<div>" +
          "<div class=\"router\" style=\"display: none;\"></div>" +
          "<div class=\"router-end\" style=\"display: none;\"></div>" +
          "</div>");
        done();
      });
    }, {once: true});

    // Now change the URL to trigger the event
    window.location.hash = "#hash1";
  });

  it("should rerender content when hash changes that affects route", (done) => {
    let renderText = "Hello World!";

    // It should first render with the text, then render it after the route changes to match
    window.location.hash = "#hash1";
    const el = (<div><Router hash={["hash1", "hash2"]}>{() => {
      return renderText;
    }}</Router></div>);
    document.body.appendChild(el);
    expect(document.body.innerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "Hello World!" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");

    // Wait until the location change event has been fired, then check whether the elements are still present.
    window.addEventListener("hashchange", function () {
      setImmediate(() => {
        expect(document.body.innerHTML).to.equal(
          "<div>" +
          "<div class=\"router\" style=\"display: none;\"></div>" +
          "Next rendering" +
          "<div class=\"router-end\" style=\"display: none;\"></div>" +
          "</div>");
        done();
      });
    }, {once: true});

    // Now change the URL to trigger the event
    renderText = "Next rendering";
    window.location.hash = "#hash2";
  });

  it("should not rerender content when hash changes that does not affect route", (done) => {
    let renderText = "Hello World!";

    // It should first render with the text, then render it after the route changes to match
    window.location.hash = "#hash1";
    const el = (<div><Router hash={["hash1", "hash2"]}>{() => {
      return renderText;
    }}</Router></div>);
    document.body.appendChild(el);
    expect(document.body.innerHTML).to.equal(
      "<div>" +
      "<div class=\"router\" style=\"display: none;\"></div>" +
      "Hello World!" +
      "<div class=\"router-end\" style=\"display: none;\"></div>" +
      "</div>");

    // Wait until the location change event has been fired, then check whether the elements are still present.
    window.addEventListener("hashchange", function () {
      setImmediate(() => {
        expect(document.body.innerHTML).to.equal(
          "<div>" +
          "<div class=\"router\" style=\"display: none;\"></div>" +
          "Hello World!" +
          "<div class=\"router-end\" style=\"display: none;\"></div>" +
          "</div>");
        done();
      });
    }, {once: true});

    // Now change the URL to trigger the event
    renderText = "Next rendering";
    window.location.hash = "#hash1&test";
  });

  it("should remove event listener after document is cleared", (done) => {
    const el = (<div><Router hash="hash">Hello World!</Router></div>);
    document.body.appendChild(el);
    document.body.innerHTML = "";

    // Fire a hash change event. The route should detect that it is not loaded and stop watching events.
    window.addEventListener("hashchange", function () {
      setImmediate(() => {
        let removed = false;
        removedListeners.forEach((v) => {removed = removed || (typeof v === "function" && v.name === "onHashChange");});
        expect(removed).to.equal(true);
        done();
      });
    }, {once: true});

    // Now change the URL to trigger the event
    window.location.hash = "#test";
  });
});
