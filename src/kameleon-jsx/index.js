import {Fragment} from "./fragment";
import {Route} from "./route";
import {appendJSX, createJSX, renderApp} from "./create-jsx";

export default createJSX;
export {
  appendJSX,
  createJSX,
  Fragment,
  renderApp,
  Route
};

// Some html namespaces
let svg, svgns;
export {svg, svgns};
