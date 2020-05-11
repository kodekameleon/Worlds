import {expect} from "chai";
import {Select} from "../../src/widgets";
import sinon from "sinon";

describe("Select widget", () => {
  it("should render select containing a button and an unordered list with a well known class name", () => {
    const el = (<Select/>);
    expect(el.outerHTML).to.equal("<div class=\"select\"><button></button><ul></ul></div>");
  });

  it("should render select including a placeholder if one is provided", () => {
    const el = (<Select placeholder={"placeholder text"}/>);
    expect(el.querySelector("button").outerHTML).to.equal("<button placeholder=\"placeholder text\"></button>");
  });

  it("should render an unordered list containing list items for each string in a string array", () => {
    const el = (
      <Select>
        {["a", "b"]}
      </Select>
    );
    const ul = el.querySelector("ul");
    expect(ul.outerHTML).to.equal("<ul><li>a</li><li>b</li></ul>");
  });

  it("should render an unordered list containing list items for each string in an object array", () => {
    const el = (
      <Select>
        {[{label: "a"}, {label: "b"}]}
      </Select>
    );
    const ul = el.querySelector("ul");
    expect(ul.outerHTML).to.equal("<ul><li>a</li><li>b</li></ul>");
  });

  it("should render an unordered list containing list items for each string in an object array and popup tips", () => {
    const el = (
      <Select>
        {[{label: "a", tip: "a tip"}, {label: "b", tip: "b tip"}]}
      </Select>
    );
    expect([...el.querySelectorAll(".popup-tip")]).to.have.length(2);
  });

  it("should show the selected element if provided", () => {
    const el = (
      <Select selected={1}>
        {["text a", "text b"]}
      </Select>
    );
    expect(el.querySelector("button").innerText).to.equal("text b");
  });

  it("should ignore the selected index if invalid", () => {
    const el = (
      <Select selected={5}>
        {["text a", "text b"]}
      </Select>
    );
    expect(el.querySelector("button").innerText).to.equal(undefined);
  });

  describe("Event handlers", () => {
    let onChange;
    let selectEl;

    beforeEach(() => {
      onChange = sinon.spy();
      selectEl = (
        <Select
          onChange={onChange}>
          {[{label: "a", id: "id a"}, "b"]}
        </Select>
      );
    });

    it("should open the drop list when the select element is clicked on", () => {
      selectEl.dispatchEvent(new MouseEvent("mousedown", {button: 0}));
      expect([...selectEl.classList.values()]).to.include("open");
    });

    it("should highlight the selected item when the drop list is opened", () => {
      selectEl = (
        <Select selected={1}>
          {[{label: "a", id: "id a"}, "b"]}
        </Select>
      );
      selectEl.querySelector("button").dispatchEvent(new Event("focus"));
      expect([...selectEl.classList.values()]).to.include("open");
      expect([...selectEl.querySelectorAll("li")[1].classList.values()]).to.include("current");
      expect([...selectEl.querySelectorAll("li")[0].classList.values()]).not.to.include("current");
    });

    it("should close the drop list when the select element is clicked on and the drop list is already open", () => {
      selectEl.dispatchEvent(new MouseEvent("mousedown", {button: 0}));
      selectEl.dispatchEvent(new MouseEvent("mousedown", {button: 0}));
      expect([...selectEl.classList.values()]).to.not.include("open");
    });

    it("should update the button text when a list item is clicked on", () => {
      const li0 = selectEl.querySelector("li");
      li0.dispatchEvent(new MouseEvent("mousedown", {button: 0}));
      expect(selectEl.querySelector("button").innerText).to.equal("a");
    });

    it("should dispatch onChange events with the index and id when clicking on a list item with an id", () => {
      const li0 = selectEl.querySelector("li");
      li0.dispatchEvent(new MouseEvent("mousedown", {button: 0}));
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.have.been.calledWith(0, "id a");
    });

    it("should dispatch onChange events with the index and text when clicking on a list item without an id", () => {
      const el = selectEl.querySelector("li + li");
      el.dispatchEvent(new MouseEvent("mousedown", {button: 0}));
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.have.been.calledWith(1, "b");
    });

    it("should not crash when selecting an item with no onChange handler", () => {
      selectEl = (
        <Select>
          {[{label: "a", id: "id a"}, "b"]}
        </Select>
      );
      const li0 = selectEl.querySelector("li");
      li0.dispatchEvent(new MouseEvent("mousedown", {button: 0}));
      expect(selectEl.querySelector("button").innerText).to.equal("a");
    });

    it("should mark list items under the mouse", () => {
      const li1 = selectEl.querySelector("li + li");
      li1.dispatchEvent(new Event("mouseenter"));
      expect([...li1.classList.values()]).to.include("current");
    });

    it("should clear marked list items under the mouse when the mouse leaves", () => {
      const li1 = selectEl.querySelector("li + li");
      li1.dispatchEvent(new Event("mouseenter"));
      expect([...li1.classList.values()]).to.include("current");

      li1.dispatchEvent(new Event("mouseleave"));
      expect([...li1.classList.values()]).to.not.include("current");
    });

    it("should clear other marked list items under the mouse when the mouse enters another item", () => {
      const li1 = selectEl.querySelector("li + li");
      li1.dispatchEvent(new Event("mouseenter"));
      expect([...li1.classList.values()]).to.include("current");

      const li0 = selectEl.querySelector("li");
      li0.dispatchEvent(new Event("mouseenter"));
      expect([...li1.classList.values()]).to.not.include("current");
      expect([...li0.classList.values()]).to.include("current");
    });

    it("should open the droplist when the button is focused", () => {
      const button = selectEl.querySelector("button");
      button.dispatchEvent(new Event("focus"));
      expect([...selectEl.classList.values()]).to.include("open");
    });

    it("should close the droplist when the button loses focus", () => {
      const button = selectEl.querySelector("button");
      button.dispatchEvent(new Event("focus"));
      expect([...selectEl.classList.values()]).to.include("open");

      button.dispatchEvent(new Event("blur"));
      expect([...selectEl.classList.values()]).to.not.include("open");
    });

    it("should open the drop list when the down arrow button is pressed", () => {
      const button = selectEl.querySelector("button");
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "ArrowDown"}));
      expect([...selectEl.classList.values()]).to.include("open");
    });

    it("should mark the first list item when the down arrow button is pressed", () => {
      const button = selectEl.querySelector("button");
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "ArrowDown"}));
      const li0 = selectEl.querySelector("li");
      expect([...li0.classList.values()]).to.include("current");
    });

    it("should wrap back to the first list item when the down arrow button is pressed on the last list item", () => {
      const button = selectEl.querySelector("button");
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "ArrowDown"}));
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "ArrowDown"}));
      const li1 = selectEl.querySelector("li + li");
      expect([...li1.classList.values()]).to.include("current");

      button.dispatchEvent(new KeyboardEvent("keydown", {code: "ArrowDown"}));
      const li0 = selectEl.querySelector("li");
      expect([...li0.classList.values()]).to.include("current");
      expect([...li1.classList.values()]).to.not.include("current");
    });

    it("should open the drop list when the up arrow button is pressed", () => {
      const button = selectEl.querySelector("button");
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "ArrowUp"}));
      expect([...selectEl.classList.values()]).to.include("open");
    });

    it("should mark the last list item when the up arrow button is pressed", () => {
      const button = selectEl.querySelector("button");
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "ArrowUp"}));

      const li1 = selectEl.querySelector("li + li");
      expect([...li1.classList.values()]).to.include("current");
    });

    it("should wrap back to the last list item when the up arrow button is pressed on the first list item", () => {
      const button = selectEl.querySelector("button");
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "ArrowUp"}));
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "ArrowUp"}));
      const li0 = selectEl.querySelector("li");
      expect([...li0.classList.values()]).to.include("current");

      button.dispatchEvent(new KeyboardEvent("keydown", {code: "ArrowUp"}));
      const li1 = selectEl.querySelector("li + li");
      expect([...li1.classList.values()]).to.include("current");
      expect([...li0.classList.values()]).not.to.include("current");
    });

    it("should open the drop list when the enter button is pressed", () => {
      const button = selectEl.querySelector("button");
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "Enter"}));
      expect([...selectEl.classList.values()]).to.include("open");
    });

    it("should close the drop list when the enter button is pressed and the drop list is open", () => {
      const button = selectEl.querySelector("button");
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "Enter"}));
      expect([...selectEl.classList.values()]).to.include("open");
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "Enter"}));
      expect([...selectEl.classList.values()]).not.to.include("open");
    });

    it("should open the drop list when the space button is pressed", () => {
      const button = selectEl.querySelector("button");
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "Space"}));
      expect([...selectEl.classList.values()]).to.include("open");
    });

    it("should close the drop list when the space button is pressed and the drop list is open", () => {
      const button = selectEl.querySelector("button");
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "Space"}));
      expect([...selectEl.classList.values()]).to.include("open");
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "Space"}));
      expect([...selectEl.classList.values()]).not.to.include("open");
    });

    it("should close the drop list when the escape button is pressed and the drop list is open", () => {
      const button = selectEl.querySelector("button");
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "Space"}));
      expect([...selectEl.classList.values()]).to.include("open");
      button.dispatchEvent(new KeyboardEvent("keydown", {code: "Escape"}));
      expect([...selectEl.classList.values()]).not.to.include("open");
    });
  });
});
