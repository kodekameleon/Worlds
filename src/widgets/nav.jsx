// import {parse} from "qs";

export function NavList(props, children) {
  return (<ol class="navlist">{children}</ol>);
}

export function NavItem(props, children) {
  if (!props.href) {
    throw "missing href for nav item";
  }

  // console.log(`hash=${window.location.hash}`);
  // console.log(`qs=${parse(window.location.hash)}`);

  return (<li><a href={props.href}><span>{children}</span></a></li>);
}
