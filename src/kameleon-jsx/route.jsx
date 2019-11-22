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
export function Route(props, children) {
  if (!props || !props["hash"]) {
    throw "Route element requires a hash attribute";
  }

  // Build a list of hash properties to check
  const routeHash = typeof props.hash === "string" ? [props.hash] : props.hash;

  // Get the hash from the window location, and reduce it to just have the relevant properties
  let locationHash = getLocationHash();

  // Add a listener so that we can rerender the children if the location hash changes in a way
  // that affects this route
  window.addEventListener("hashchange", onHashChange);

  const fragment = (
    <Fragment>
      <div class="route" style={{display: "none"}}/>
      {isMatch() ? children : undefined}
      <div class="route-end" style={{display: "none"}}/>
    </Fragment>
  );

  const firstEl = fragment.firstChild;
  const lastEl = fragment.lastChild;

  return fragment;

  function onHashChange() {
    // If the route is no longer in the DOM it has been removed by some higher level route going
    // out of scope, so remove the change handler.
    if (!firstEl || !firstEl.isConnected) {
      window.removeEventListener("hashchange", onHashChange);
      return;
    }

    // If the parts of the location hash that are relevant to this route have not changed don't do anything
    const newLocationHash = getLocationHash();
    if (_.isEqual(locationHash, newLocationHash)) {
      return;
    }
    locationHash = newLocationHash;

    // Remove all of the elements inside the route. Skip over the route place holders.
    let el = firstEl.nextSibling;
    while (el && el !== lastEl) {
      const removeEl = el;
      el = el.nextSibling;
      removeEl.remove();
    }

    // If the route does not match there is nothing to render, so just exit.
    if (!isMatch()) {
      return;
    }

    // Now render new elements and insert them
    const parent = (<div>{children}</div>);
    for (const child of parent.childNodes) {
      lastEl.parentNode.insertBefore(child, lastEl);
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
