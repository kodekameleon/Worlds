import {expect} from "chai";
import {UndoStack} from "../../src/actions/undo-stack";

describe("UndoStack", () => {
  let undoStack;

  beforeEach(() => {
    undoStack = new UndoStack();
  });

  it("should perform an action", () => {
    let done = 0;
    const didit = undoStack.do(() => {done = 1; return () => true; });

    expect(done).to.equal(1);
    expect(didit).to.equal(true);
  });

  it("should perform an action requiring parameters", () => {
    let doneA = 0, doneB = 0;
    const didit = undoStack.do((a, b) => {doneA = a; doneB = b; return () => true; }, 1, 2);

    expect(doneA).to.equal(1);
    expect(doneB).to.equal(2);
    expect(didit).to.equal(true);
  });

  it("should record an action when something changes", () => {
    let done = 0;
    const didit = undoStack.do(() => {done = 1; return () => true; });

    expect(done).to.equal(1);
    expect(didit).to.equal(true);
    expect(undoStack.undoLength).to.equal(1);
    expect(undoStack.canUndo).to.equal(true);
  });

  it("should not record an action for noops", () => {
    const didit = undoStack.do(() => undefined);

    expect(didit).to.equal(false);
    expect(undoStack.undoLength).to.equal(0);
    expect(undoStack.canUndo).to.equal(false);
  });

  it("should undo an action", () => {
    let done = 0;

    function action() {
      done = true;
      return () => { done = false; return action; };
    }

    const didit = undoStack.do(action);

    expect(done).to.equal(true);
    expect(didit).to.equal(true);
    expect(undoStack.undoLength).to.equal(1);
    expect(undoStack.redoLength).to.equal(0);
    expect(undoStack.canUndo).to.equal(true);
    expect(undoStack.canRedo).to.equal(false);

    undoStack.undo();

    expect(done).to.equal(false);
    expect(undoStack.undoLength).to.equal(0);
    expect(undoStack.redoLength).to.equal(1);
    expect(undoStack.canUndo).to.equal(false);
    expect(undoStack.canRedo).to.equal(true);
  });

  it("should redo an action", () => {
    let done = 0;

    function action() {
      done = true;
      return () => { done = false; return action; };
    }

    const didit = undoStack.do(action);

    expect(done).to.equal(true);
    expect(didit).to.equal(true);
    expect(undoStack.undoLength).to.equal(1);
    expect(undoStack.redoLength).to.equal(0);
    expect(undoStack.canUndo).to.equal(true);
    expect(undoStack.canRedo).to.equal(false);

    undoStack.undo();

    expect(done).to.equal(false);
    expect(undoStack.undoLength).to.equal(0);
    expect(undoStack.redoLength).to.equal(1);
    expect(undoStack.canUndo).to.equal(false);
    expect(undoStack.canRedo).to.equal(true);

    undoStack.redo();

    expect(done).to.equal(true);
    expect(undoStack.undoLength).to.equal(1);
    expect(undoStack.redoLength).to.equal(0);
    expect(undoStack.canUndo).to.equal(true);
    expect(undoStack.canRedo).to.equal(false);
  });

  it("should clear the redo buffer when doing a new action", () => {
    let done = 0;

    function action() {
      done = true;
      return () => { done = false; return action; };
    }

    undoStack.do(action);
    undoStack.undo();

    expect(done).to.equal(false);
    expect(undoStack.undoLength).to.equal(0);
    expect(undoStack.redoLength).to.equal(1);
    expect(undoStack.canUndo).to.equal(false);
    expect(undoStack.canRedo).to.equal(true);

    undoStack.do(action);

    expect(done).to.equal(true);
    expect(undoStack.undoLength).to.equal(1);
    expect(undoStack.redoLength).to.equal(0);
    expect(undoStack.canUndo).to.equal(true);
    expect(undoStack.canRedo).to.equal(false);
  });

  it("should undo and redo the last action", () => {
    let done = 0;

    function action10() {
      const oldDone = done;
      done = 10;
      return () => { done = oldDone; return action10; };
    }

    function action20() {
      const oldDone = done;
      done = 20;
      return () => { done = oldDone; return action20; };
    }

    undoStack.do(action10);
    expect(done).to.equal(10);

    undoStack.do(action20);
    expect(done).to.equal(20);

    undoStack.undo();
    expect(done).to.equal(10);

    undoStack.undo();
    expect(done).to.equal(0);

    expect(undoStack.undoLength).to.equal(0);
    expect(undoStack.redoLength).to.equal(2);
    expect(undoStack.canUndo).to.equal(false);
    expect(undoStack.canRedo).to.equal(true);

    undoStack.redo();
    expect(done).to.equal(10);

    undoStack.redo();
    expect(done).to.equal(20);

    expect(undoStack.undoLength).to.equal(2);
    expect(undoStack.redoLength).to.equal(0);
    expect(undoStack.canUndo).to.equal(true);
    expect(undoStack.canRedo).to.equal(false);
  });

  it("should return false if there is nothing to undo", () => {
    const res = undoStack.undo();
    expect(res).to.equal(false);
  });

  it("should return false if there is nothing to redo", () => {
    const res = undoStack.redo();
    expect(res).to.equal(false);
  });

  it("should discard old undo records when it overflows", () => {
    let done = 0;
    let value = 0;

    function action() {
      const oldDone = done;
      value = value + 10;
      done = value;
      return () => { done = oldDone; return action; };
    }

    for (let i = 0; i < 200; ++i) {
      undoStack.do(action);
    }

    expect(undoStack.undoLength).to.equal(100);

    while(undoStack.undo());

    expect(undoStack.undoLength).to.equal(0);
    expect(undoStack.redoLength).to.equal(100);
    expect(done).to.equal(1000);
  });
});
