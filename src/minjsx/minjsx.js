export function minjsx(elemType, props) {
  let el;
  if (typeof elemType === "string") {
    el = document.createElement(elemType);
  } else {
    el = elemType(props, [].slice.call(arguments).slice(2));
  }

  if (el && props) {
    for (const key of Object.keys(props)) {
      el.setAttribute(key, props[key]);
    }
  }

  if (el && arguments.length === 3 && typeof arguments[2] === "string") {
    el.textContent = arguments[2];
  } else if (el && arguments.length > 2) {
    for (let i = 2; i < arguments.length; ++i) {
      el.appendChild(arguments[i]);
    }
  }

  return el;
}
