import {getNamespaceUri} from "./namespaces";

/**
 * Create a thing for JSX
 *
 * @param tagOrFn
 * @param props
 * @param props.props     Delegated props
 * @param props.class     A string, or list of strings, containing class names. For custom elements this will be
 *                        flattened into a string before being passed to the element function.
 * @param props.className Alias for props.class
 * @param children
 * @returns {HTMLElement}
 */
export function createJSX(tagOrFn, srcProps, ...children) {
  // Ensure there is a valid props object
  srcProps = srcProps || {};

  // Process the classes from a string or list, merge the source and delegated classes.
  const classes = processClassName(srcProps);

  // Make a mutable copy of the props, merging in the delegated props if there are any.
  const props = Object.assign({}, srcProps.props, srcProps, classes ? {class: classes, className: classes} : {});
  delete props.props;

  // Make sure that if a ref is required the ref object has been initialized.
  if (props.hasOwnProperty("ref") && !props.ref) {
    throw "References must be initialized when creating elements with a reference";
  }

  let el;
  if (typeof tagOrFn === "string") {
    const {nsUri, tag} = getNamespaceUri(tagOrFn);
    if (nsUri) {
      el = document.createElementNS(nsUri, tag);
    } else {
      el = document.createElement(tagOrFn);
    }

    // Set the class for the element. Split the class into tokens so that repeated tokens are removed.
    if (props.class) {
      el.classList.add(...props.class.split(" "));
    }

    // Add the rest of the props to the element
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
          // All of the class related attributes have been handled above
          break;

        case "ref":
          // ref is a special case, handled later
          break;

        case key.indexOf("on:") === 0 && key:
          el.addEventListener(key.substr(3), props[key]);
          break;

        default:
          // A custom attribute, custom attributes are only applied when they are provided in the
          // source props, not when they are provided in the delegated props.
          if (srcProps.hasOwnProperty(key) && srcProps[key] !== undefined) {
            el.setAttribute(key, props[key]);
          }
          break;
      }
    }
    appendJSX(el, children);
  } else if (typeof tagOrFn === "function") {
    // If custom elements pass the children through on a subnode they can get
    // nested inside arrays, so lets get rid of that nesting here.
    children = children.flat(Infinity);

    // Call the function to create the element or object
    el = new tagOrFn(props, children);

    // If the creator is a class, get the element by calling the render method.
    if (el.render && typeof el.render === "function") {
      if (props.ref) {
        props.ref.object = el;
      }
      el = el.render(props, children);
    }
  } else {
    throw "JSX element must be a string for a standard element or a function";
  }

  if (props.ref) {
    props.ref.element = el;
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
  } else if (typeof child === "object" && child?.tagName === "FRAGMENT") {
    // Strip out fragments and just add the children, reduce the childnodes into an array
    appendJSX(el, [...child.childNodes].reduce((l, v) => [...l, v], []));
  } else if (child !== undefined && child !== null && child !== false && child !== true) {
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
  let classes = props.class || props.className;
  if (props.props?.class || props.props?.className) {
    classes = [classes, props.props.class || props.props.className];
  }
  if (classes && Array.isArray(classes)) {
    return classes.flat(Infinity).reduce((l, v) => v && v !== "" ? [...l, v] : l, []).join(" ");
  }
  return classes;
}
