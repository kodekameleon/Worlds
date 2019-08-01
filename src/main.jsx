import {Fragment, Router} from "./kameleon-jsx";
import {Logo} from "./widgets/logo";
import {NavItem, NavList} from "./widgets";


window.addEventListener("load", main);

function main() {
  console.log("starting!");

  const render = (
    <div>
      <div class="header">
        <Logo/>
        <Router hash={["worldmaps", "citymaps", "parties", "encounters"]} always>
          {() => (
            <Fragment>
              <NavList>
                <NavItem href="#worldmaps">WORLĐ MAPS</NavItem>
                <NavItem href="#citymaps">CITY MAPS</NavItem>
                <NavItem href="#parties">PARTIES</NavItem>
                <NavItem href="#encounters">ENCOUNTERS</NavItem>

                <li/>
              </NavList>
            </Fragment>
          )}
        </Router>
      </div>
      <Router hash={"worldmaps"}>
        WORLD MAPS
      </Router>
      <Router hash={"citymaps"}>
        CITY MAPS
      </Router>
      <Router hash={["worldmaps", "citymaps", "parties", "encounters"]} none>
        HOME
      </Router>
    </div>
  );

  const root = document.getElementById("root");
  root.innerHTML = "";
  root.appendChild(render);
}

