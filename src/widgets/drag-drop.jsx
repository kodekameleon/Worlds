import "./drag-drop.css";

/**
 * Manages a drop target by taking care of some of the housekeeping of highlighting a drop target during
 * drag and drop operations.
 *
 * @param props {
 *   class: classes to add to the element
 *
 *   canDrop(event): function returning true if the target can accept the source being dragged
 *
 *   onDrop(event): function called when the source is dropped on the target. This is only called in canDrop() returns true
 *
 *   onDragEnter(event): optional function called when the target is entered with the mouse
 *
 *   onDragLeave(event): optional function called when the target is exited with the mouse
 * }
 *
 * @param children The child elements
 * @returns element
 */
export function DropTarget(props, children) {
  const el = (
    <div class={["drop-target", props.class]} on:dragover={onDragOver} on:drop={onDrop} on:dragenter={onDragEnter} on:dragleave={onDragLeave}>
      {children}
    </div>
  );
  return el;

  function onDragOver(ev) {
    if (props.canDrop(ev)) {
      ev.preventDefault();
    }
  }

  function onDrop(ev) {
    el.classList.remove("drag-hover");
    if (props.canDrop(ev)) {
      ev.preventDefault();
      props.onDrop(ev);
    }
  }

  function onDragEnter(ev) {
    if (props.canDrop(ev)) {
      el.classList.add("drag-hover");

      if(props.onDragEnter) {
        props.onDragEnter(ev);
      }
    }
  }

  function onDragLeave(ev) {
    el.classList.remove("drag-hover");

    if(props.onDragLeave) {
      props.onDragLeave(ev);
    }
  }
}

export function DragHandle() {
  return <div className="drag-handle"/>;
}
