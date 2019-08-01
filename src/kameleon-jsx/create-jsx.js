import * as _ from "lodash";

export function createJSX(elemType, props, ...children) {
  let el;
  if (typeof elemType === "string") {
    el = document.createElement(elemType);

    // Add all of the props to the element
    if (props) {
      for (const key of Object.keys(props)) {
        if (key === "style") {
          const styles = props[key];
          for (const style of Object.keys(styles)) {
            el.style[style] = styles[style];
          }
        } else if (key === "className") {
          console.log(`Replaced className with class on element ${el.tagName}`);
          el.setAttribute("class", props[key]);
        } else {
          el.setAttribute(key, props[key]);
        }
      }
    }
    appendChildren(el, children);
  } else if (typeof elemType == "function") {
    // If custom elements pass the children through on a subnode they can get
    // nested inside arrays, so lets get rid of that nesting here.
    while (children.length === 1 && Array.isArray(children[0])) {
      children = children[0];
    }

    // Call the function to create the element
    el = elemType(props, children);
  } else {
    throw "JSX element must be a string for a standard element or a function";
  }

  return el;
}

function appendChildren(el, child) {
  if (Array.isArray(child)) {
    for (const descendent of child) {
      appendChildren(el, descendent);
    }
  } else if (typeof child === "function") {
    appendChildren(el, child());
  } else if (typeof child === "object" && child.tagName === "FRAGMENT") {
    // Strip out fragments and just add the children, reduce the childnodes into an array
    appendChildren(el, _.reduce(child.childNodes, (l, v) => [...l, v], []));
  } else if (child != undefined) {
    el.append(child);
  }
}
