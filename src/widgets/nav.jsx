import {parse} from "querystringify";
import * as _ from "lodash";
import "./nav.css";

export function NavList(props, children) {
  return (<ol class="navlist">{children}</ol>);
}

export function NavItem(props, children) {
  if (!props || !props.href) {
    throw "Missing href for nav item";
  }

  // Add a listener so that we can update the navitem classes when the page changes
  window.addEventListener("hashchange", onHashChange);

  const element = (<li class={getCssClass()}><a href={props.href} draggable={false}><span>{children}</span></a></li>);
  return element;

  function getCssClass() {
    let cssClass = "";

    // Check whether the URL matches the href
    if (props.href.length > 0 && props.href.charAt(0) === "#") {
      const hash = (window.location.hash && window.location.hash.length > 0 && parse(window.location.hash.substr(1))) || {};
      if (hash[props.href.substring(1)] !== undefined || (_.isEmpty(hash) && props.href === "#")) {
        cssClass = "selected";
      }
    }
    return cssClass;
  }

  function onHashChange() {
    if (!element || !element.isConnected) {
      window.removeEventListener("hashchange", onHashChange);
      return;
    }

    element.className = getCssClass();
  }
}

