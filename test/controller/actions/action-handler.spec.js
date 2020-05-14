import {expect} from "chai";
import sinon from "sinon";
import {ActionHandler, UndoStack} from "../../../src/controller/actions";

describe("ActionHandler", () => {
  let undoStack;

  beforeEach(() => {
    undoStack = new UndoStack();
  });

  it("should create a handler function", () => {
    const actionHandler = new ActionHandler({}, undoStack);
    expect(typeof actionHandler.do()).to.equal("function");
  });

  it("should pass do parameters to the action", () => {
    let params;
    const actionHandler = new ActionHandler({}, undoStack);
    const handler = actionHandler.do((...args) => { params = args; }, "do1", "do2");
    handler();
    expect(params).to.deep.equal([{}, "do1", "do2"]);
  });

  it("should pass event parameters to the action", () => {
    let params;
    const actionHandler = new ActionHandler({}, undoStack);
    const handler = actionHandler.do((...args) => { params = args; });
    handler("event1", "event2");
    expect(params).to.deep.equal([{}, "event1", "event2"]);
  });

  it("should pass do and event parameters to the action", () => {
    let params;
    const actionHandler = new ActionHandler({}, undoStack);
    const handler = actionHandler.do((...args) => { params = args; }, "do1", "do2");
    handler("event1", "event2");
    expect(params).to.deep.equal([{}, "do1", "do2", "event1", "event2"]);
  });

  it("should render and publish if the action causes changes", () => {
    let rendered, published;
    const actionHandler = new ActionHandler({}, undoStack, () => { rendered = true; }, () => { published = true; });
    const handler = actionHandler.do(() => { return {a: true}; });
    handler();
    expect(rendered).to.equal(true);
    expect(published).to.equal(true);
  });

  it("should not render or publish if the action does not cause changes", () => {
    let rendered, published;
    const actionHandler = new ActionHandler({}, undoStack, () => { rendered = true; }, () => { published = true; });
    const handler = actionHandler.do(() => undefined);
    handler();
    expect(rendered).to.equal(undefined);
    expect(published).to.equal(undefined);
  });

  it("should skip publishing if there is no publisher", () => {
    let rendered, published;
    const actionHandler = new ActionHandler({}, undoStack, () => { rendered = true; });
    const handler = actionHandler.do(() => { return {a: true}; });
    handler();
    expect(rendered).to.equal(true);
    expect(published).to.equal(undefined);
  });

  it("should skip rendering if there is no renderer", () => {
    let rendered, published;
    const actionHandler = new ActionHandler({}, undoStack, undefined, () => { published = true; });
    const handler = actionHandler.do(() => { return {a: true}; });
    handler();
    expect(rendered).to.equal(undefined);
    expect(published).to.equal(true);
  });

  it("should record an undo in the UndoStack", () => {
    const actionHandler = new ActionHandler({}, undoStack);
    const handler = actionHandler.do(() => { return {a: true}; });
    handler();
    expect(undoStack.undoLength).to.equal(1);
  });

  it("should create an undo function that calls UndoStack.undo", () => {
    const actionHandler = new ActionHandler({}, undoStack);
    const undo = actionHandler.undo();

    expect(typeof undo).to.equal("function");

    const spy = sinon.spy(undoStack, "undo");

    undo();

    expect(spy).to.have.been.calledOnce;
  });

  it("should create an undo function that calls UndoStack.undo, and renders", () => {
    let rendered;
    const actionHandler = new ActionHandler({}, undoStack, () => { rendered = true; });
    const undo = actionHandler.undo();

    expect(typeof undo).to.equal("function");

    const spy = sinon.stub(undoStack, "undo").callsFake(() => true);

    undo();

    expect(spy).to.have.been.calledOnce;
    expect(rendered).to.equal(true);
  });

  it("should create a redo function that calls UndoStack.redo", () => {
    const actionHandler = new ActionHandler({}, undoStack);
    const redo = actionHandler.redo();

    expect(typeof redo).to.equal("function");

    const spy = sinon.spy(undoStack, "redo");

    redo();

    expect(spy).to.have.been.calledOnce;
  });

  it("should create a redo function that calls UndoStack.redo, and renders", () => {
    let rendered;
    const actionHandler = new ActionHandler({}, undoStack, () => { rendered = true; });
    const redo = actionHandler.redo();

    expect(typeof redo).to.equal("function");

    const spy = sinon.stub(undoStack, "redo").callsFake(() => true);

    redo();

    expect(spy).to.have.been.calledOnce;
    expect(rendered).to.equal(true);
  });
});
