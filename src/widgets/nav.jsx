import {parse} from "querystringify";
import * as _ from "lodash";

export function NavList(props, children) {
  return (<ol class="navlist">{children}</ol>);
}

export function NavItem(props, children) {
  if (!props || !props.href) {
    throw "Missing href for nav item";
  }

  let classes = "";

  // Check whether the URL matches the href
  if (props.href.length > 0 && props.href.charAt(0) === "#") {
    const hash = (window.location.hash && window.location.hash.length > 0 && parse(window.location.hash.substr(1))) || {};
    if (hash[props.href.substring(1)] != undefined || (_.isEmpty(hash) && props.href === "#")) {
      classes = "selected";
    }
  }

  return (<li class={classes}><a href={props.href}><span>{children}</span></a></li>);
}

