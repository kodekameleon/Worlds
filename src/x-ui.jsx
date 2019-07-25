export function X(props, children) {
  const el = document.createElement("div");
  if (el && props) {
    for (const key of Object.keys(props)) {
      el.setAttribute(key, props[key]);
    }
  }
  for (const child of children) {
    el.appendChild(child);
  }
  return el;
}
