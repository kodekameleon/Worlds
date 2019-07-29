
window.addEventListener("load", main);

import {Logo} from "./widgets/logo";
import {NavItem, NavList} from "./widgets";

function main() {
  console.log("starting!");

  const root = document.getElementById("root");
  root.innerHTML = "";
  root.appendChild(
    <div>
      <Logo/>
      <NavList>
        <NavItem href="#worldmaps">WORLĐ MAPS</NavItem>
        <NavItem href="#citymaps">CITY MAPS</NavItem>
      </NavList>
    </div>
  );
}
