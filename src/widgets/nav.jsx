import {parse} from "querystringify";

export function NavList(props, children) {
  return (<ol class="navlist">{children}</ol>);
}

export function NavItem(props, children) {
  if (!props.href) {
    throw "missing href for nav item";
  }

  let classes = "";

  // Check whether the URL matches the href
  if (props.href.length > 0 && props.href.charAt(0) === "#") {
    const hash = window.location.hash && window.location.hash.length > 0 && parse(window.location.hash.substr(1));
    if (hash[props.href.substring(1)] != undefined) {
      classes = "selected";
    }
  }

  return (<li class={classes}><a href={props.href}><span>{children}</span></a></li>);
}

