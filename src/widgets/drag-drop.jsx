import "./drag-drop.css";

/**
 * Manages a drop target by taking care of some of the housekeeping of highlighting a drop target during
 * drag and drop operations.
 *
 * @param props
 * @param props.canDrop function returning true if the target can accept the source being dragged
 * @param props.onDrop function called when the source is dropped on the target. This is only called in canDrop() returns true
 * @param props.onDragEnter optional function called when the target is entered with the mouse
 * @param props.onDragLeave optional function called when the target is exited with the mouse
 * @param children The child elements
 * @returns {element}
 */
export function DropTarget(props, children) {
  const el = (
    <div class="drop-target" props={props} on:dragover={onDragOver} on:drop={onDrop} on:dragenter={onDragEnter} on:dragleave={onDragLeave}>
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

/**
 * Manages a drop target by taking care of some of the housekeeping of highlighting a drop target during
 * drag and drop operations.
 *
 * @param props
 * @param props.canDrag optional function returning true if the object can be dragged
 * @param props.onDragStart optional function called when the drag begins
 * @param props.onDragEnd optional function called when the drag ends
 * @param props.createDragImage optional function used to create the drag image
 * @param children The child elements
 * @returns {element}
 */
export function DragSource(props, children) {
  let parentTargetEl;
  let dragDropSite;

  const el = (
    <div class="drag-source"
         draggable={props.draggable != undefined ? props.draggable : true}
         on:dragstart={onDragStart}
         on:dragend={onDragEnd}>
      {children}
    </div>
  );
  return el;

  function onDragStart(ev) {
    // Check if the element can be dragged at this time
    if (props.canDrag && !props.canDrag(ev)) {
      ev.preventDefault();
      return false;
    }

    // Notify that the drag has started
    if (props.onDragStart) {
      props.onDragStart(ev);
    }

    // If the drag source is a child of a drag target, mark the target as also being the source
    parentTargetEl = el.closest(".drop-target");
    if (parentTargetEl) {
      parentTargetEl.classList.add("drag-origin");
    }

    // Mark the container, or document, to show that a drag operation is in progress
    dragDropSite = el.closest(".drag-drop-site") || document.getElementById("root");
    dragDropSite.classList.add("dragging");

    // If a custom drag image is being used create it and position it correctly
    if (props.createDragImage) {
      const img = props.createDragImage(ev);
      const elbr = el.getBoundingClientRect();
      img.style.minWidth = `${elbr.width}px`;
      setTimeout(() => img.remove());
      el.appendChild(img);
      const imgbr = img.getBoundingClientRect();
      ev.dataTransfer.setDragImage(
        img,
        ev.clientX - elbr.left + (imgbr.width - elbr.width) / 2,
        ev.clientY - elbr.top + (imgbr.height - elbr.height) / 2);
    }
  }

  function onDragEnd(ev) {
    if (props.onDragEnd) {
      props.onDragEnd(ev);
    }

    if (parentTargetEl) {
      parentTargetEl.classList.remove("drag-origin");
      parentTargetEl = undefined;
    }

    if (dragDropSite) {
      dragDropSite.classList.remove("dragging");
      dragDropSite = undefined;
    }
  }
}

/**
 * A simple container that helps with creating custom drag drop images
 *
 * @param props
 * @param children
 * @returns {element}
 */
export function DragImage(props, children) {
  return (<div class="drag-image" props={props}>{children}</div>);
}

/**
 * A container for drag drop operations. In cases where elements can be dragged and dropped within the bounds
 * of a parent widget, use DragDropSite for the parent. It will limit target highlighting to just the children
 * of the DragDropSite.
 *
 * @param props
 * @param children
 * @returns {element}
 */
export function DragDropSite(props, children) {
  return (<div class="drag-drop-site" props={props}>{children}</div>);
}

/**
 * A simple drag handle icon
 *
 * @returns {element}
 */
export function DragHandle() {
  return <div class="drag-handle"/>;
}
