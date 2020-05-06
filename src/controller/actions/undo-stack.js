const UNDO_LIMIT = 100;

/**
 * UndoStack manages the undo and redo stacks.
 *
 * UndoStack performs an action and records the undo action in the undo stack. Later the action can
 * be undone, and it will be recorded in the redo stack.
 *
 * UndoStack does not perform rendering or publishing changes to a datastore. Those operations should
 * be performed by a controller, usually the controller that causes UndoStack to perform an action.
 */
export class UndoStack {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Perform an action and remember the changes for later undo. This clears the redo stack.
   *
   * @param action      The action to perform
   * @param params      The parameters required by the action
   * @returns {boolean} True if any changes were made, false otherwise
   */
  do(action, ...params) {
    const undoFn = action(...params);
    if (undoFn) {
      this.undoStack.push(undoFn);
      this.redoStack = [];

      // Don't let the undo stack grow beyond the limit. This looks awful,
      // but the stack should never get more than 1 element too large, and
      // the browser can do shift really fast, so it's better than slice.
      while (this.undoStack.length > UNDO_LIMIT) {
        this.undoStack.shift();
      }

      return true;
    } else {
      return false;
    }
  }

  /**
   * Undo the last action carried out, and remember it for redo.
   */
  undo() {
    if (this.undoStack.length > 0) {
      this.redoStack.push(this.undoStack.pop()());
      return true;
    }
    return false;
  }

  /**
   * Redo the last action undone, and remember it for undo.
   */
  redo() {
    if (this.redoStack.length > 0) {
      this.undoStack.push(this.redoStack.pop()());
      return true;
    }
    return false;
  }

  /**
   * Check if there is anything to undo
   * @returns {boolean} True if undo will do anything
   */
  get canUndo() {
    return this.undoStack.length > 0;
  }

  /**
   * Get the length of the undo stack
   * @returns {number} the length of the undo stack
   */
  get undoLength() {
    return this.undoStack.length;
  }

  /**
   * Check if there is anything to redo
   * @returns {boolean} True if redo will do anything
   */
  get canRedo() {
    return this.redoStack.length > 0;
  }

  /**
   * Get the length of the redo stack
   * @returns {number} the length of the redo stack
   */
  get redoLength() {
    return this.redoStack.length;
  }
}
