
export class ActionHandler {
  constructor(model, undoStack, render, publish) {
    this.model = model;
    this.render = render;
    this.undoStack = undoStack;
    this.publish = publish;
  }

  do(action, ...params) {
    return (...eventParams) => {
      if (this.undoStack.do(action, this.model, ...params, ...eventParams)) {
        // If anything in the model changed, redraw the view
        if (this.render) {
          this.render();
        }

        // Publish the changes to the model to the server
        if (this.publish) {
          this.publish(this.model);
        }
      }
    };
  }
}
