import {parse} from "querystringify";
import {Fragment} from "./fragment";
import * as _ from "lodash";

/**
 *
 * @param props
 * @param children
 * @returns {*}
 * @constructor
 */
export function Router(props, children) {
  if (!props["key"]) {
    throw "Router element requires a key attribute";
  }
  if (!props["hash"]) {
    throw "Router requires a hash attribute.";
  }

  // Build a list of hash properties to check
  const routeHash = typeof props.hash === "string" ? [props.hash] : props.hash;

  // Create IDs for the first and last element surrounding the route
  const firstId = `router:${props.key}`;
  const lastId = `router-end:${props.key}`;

  // Get the hash from the window location, and reduce it to just have the relevant properties
  let locationHash = getLocationHash();

  // Add a listener so that we can rerender the children if the location hash changes in a way
  // that affects this route
  window.addEventListener("hashchange", onHashChange);

  return (
    <Fragment>
      <div id={firstId} class="router" style={{display: "none"}}/>
      {isMatch()
        ? (children && children.length > 0 && typeof (children[0]) === "string" ? (<span>{children}</span>) : children)
        : undefined}
      <div id={lastId} class="router" style={{display: "none"}}/>
    </Fragment>
  );

  function onHashChange() {
    // Get the new location hash and check if it is different from the previous location hash. If it is
    // different we will rerender the children and update the DOM. If the new location hash no longer
    // matches the route, we will remove the children from the DOM.
    const newLocationHash = getLocationHash();
    if (!_.isEqual(locationHash, newLocationHash)) {
      locationHash = newLocationHash;

      // Get the first and last element of the router. If the router is no longer in the DOM
      // it has been removed by some higher level router going out of scope, so remove the change handler.
      let el = document.getElementById(firstId).nextSibling;
      const lastEl = document.getElementById(lastId);
      if (!el) {
        console.log("Router no longer in dom, removing event listener");
        window.removeEventListener("hashchange", onHashChange);
        return;
      }

      // Remove all of the elements inside the router.
      while (el !== lastEl) {
        const removeEl = el;
        el = el.nextSibling;
        removeEl.remove();
      }

      if (!isMatch()) {
        return;
      }

      // Now render new elements and insert them
      const parent = (
        <div>
          {children && children.length > 0 && typeof (children[0]) === "string" ? (<span>{children}</span>) : children}
        </div>
      );
      for (const child of parent.childNodes) {
        lastEl.parentNode.insertBefore(child, lastEl);
      }
    }
  }

  function getLocationHash() {
    const hash = window.location.hash && parse(window.location.hash.substr(1));
    return _.pick(hash, routeHash);
  }

  function isMatch() {
    if ("always" in props) {
      return true;
    }

    const none = "none" in props;

    for (const hash of routeHash) {
      if (hash in locationHash) {
        return none ? false : true;
      }
    }

    return none ? true : false;
  }
}
