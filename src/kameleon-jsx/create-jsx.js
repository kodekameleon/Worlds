import * as _ from "lodash";

import {getNamespaceUri} from "./namespaces";

/**
 * Create a thing for JSX
 *
 * @param tagOrFn
 * @param props
 * @param children
 * @returns {HTMLElement}
 */
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
      const classes = processClassName(props);
      if (classes) {
        el.setAttribute("class", classes);
      }

      const addClasses = processAddClasses(props);
      if (addClasses) {
        el.classList.add(...addClasses);
      }

      for (const key of Object.keys(props)) {
        switch (key) {
          case "style": {
            const styles = props[key];
            if (typeof styles === "string") {
              el.style.cssText = styles;
            } else {
              for (const style of Object.keys(styles)) {
                el.style[style] = styles[style];
              }
            }
            break;
          }

          case "class":
          case "className":
          case "addClass":
          case "add-class":
            // All of the class related attributes are handled separately
            break;

          case key.indexOf("on:") === 0 && key:
            el.addEventListener(key.substr(3), props[key]);
            break;

          default:
            el.setAttribute(key, props[key]);
            break;
        }
      }
    }

    appendJSX(el, children);
  } else if (typeof tagOrFn == "function") {
    props = props || {};

    if (props.addClass || props["add-class"]) {
      throw "May not specify addClass or add-class when creating a custom element";
    }

    // If custom elements pass the children through on a subnode they can get
    // nested inside arrays, so lets get rid of that nesting here.
    while (children.length === 1 && Array.isArray(children[0])) {
      children = children[0];
    }

    // If the props contain class or className make sure it contains both.
    if (props.className || props.class) {
      props.class = props.className = processClassName(props);
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
    throw "To render the application there must be an element with the id #root in the document";
  }

  root.innerHTML = "";
  appendJSX(root, app);
}

function processClassName(props) {
  const classes = props.class || props.className;
  if (classes && Array.isArray(classes)) {
    return classes.reduce((l, v) => v && v !== "" ? [...l, v] : l, []).join(" ");
  }
  return classes;
}

function processAddClasses(props) {
  const addClasses = props.addClass || props["add-class"];
  if (addClasses && typeof addClasses === "string") {
    return addClasses.split(" ");
  }
  if (addClasses && Array.isArray(addClasses)) {
    return addClasses.reduce((l, v) => v && v !== "" ? [...l, v] : l, []);
  }
  return addClasses;
}
