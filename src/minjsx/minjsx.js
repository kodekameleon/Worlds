export function minjsx(elemType, props, ...children) {
  let el;
  if (typeof elemType === "string") {
    el = document.createElement(elemType);
    if (!el) {
      throw `Error creating dom element for ${elemType}`;
    }

    // Add all of the props to the element
    if (props) {
      for (const key of Object.keys(props)) {
        el.setAttribute(key, props[key]);
      }
    }

    // When a custom element is passing its children through to the elements it is creating
    // they will be passed as an array, and the fist child then be an array containing all
    // of the children, so take care of that case here.
    if (children.length === 1 && Array.isArray(children[0])) {
      children = children[0];
    }

    // Children may be an array of child elements or a string
    if (children.length === 1 && typeof children[0] === "string") {
      el.textContent = children[0];
    } else if (children.length > 0) {
      for (const child of children) {
        el.appendChild(child);
      }
    }
  } else if (typeof elemType == "function") {
    // Call the function to create the element
    el = elemType(props, children);
  } else {
    throw "JSX element must be a string for a standard element or a function name";
  }

  return el;
}
