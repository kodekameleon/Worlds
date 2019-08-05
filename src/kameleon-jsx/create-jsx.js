import * as _ from "lodash";

import {getNamespaceUri} from "./namespaces";

const events = [
  "onclick",
  "onmousedown",
  "onmousemove",
  "onpointermove",
  "onpointerdown",
  "onpointerup",
  "onkeydown"
];

export function createJSX(tagOrFn, props, ...children) {
  let el;
  if (typeof tagOrFn === "string") {
    const {nsUri, tag} = getNamespaceUri(tagOrFn);
    if (nsUri) {
      el = document.createElementNS(nsUri, tag);
    } else {
      el = document.createElement(tagOrFn);
    }

    // Add all of the props to the element
    if (props) {
      for (const key of Object.keys(props)) {
        if (key === "style") {
          const styles = props[key];
          if (typeof styles === "string") {
            el.style.cssText = styles;
          } else {
            for (const style of Object.keys(styles)) {
              el.style[style] = styles[style];
            }
          }
        } else if (key === "className") {
          el.setAttribute("class", props[key]);
        } else if (events.includes(key)) {
          el[key] = props[key];
        } else {
          el.setAttribute(key, props[key]);
        }
      }
    }
    appendJSX(el, children);
  } else if (typeof tagOrFn == "function") {
    // If custom elements pass the children through on a subnode they can get
    // nested inside arrays, so lets get rid of that nesting here.
    while (children.length === 1 && Array.isArray(children[0])) {
      children = children[0];
    }

    // Call the function to create the element
    el = tagOrFn(props, children);
  } else {
    throw "JSX element must be a string for a standard element or a function";
  }

  return el;
}

export function appendJSX(el, child) {
  if (Array.isArray(child)) {
    for (const descendent of child) {
      appendJSX(el, descendent);
    }
  } else if (typeof child === "function") {
    appendJSX(el, child());
  } else if (typeof child === "object" && child.tagName === "FRAGMENT") {
    // Strip out fragments and just add the children, reduce the childnodes into an array
    appendJSX(el, _.reduce(child.childNodes, (l, v) => [...l, v], []));
  } else if (child != undefined) {
    el.append(child);
  }
}

export function renderApp(app) {
  const root = document.getElementById("root");
  if (!root) {
    throw "To render the appliication there must be an element with the id #root in the document";
  }

  root.innerHTML = "";
  appendJSX(root, app);
}
