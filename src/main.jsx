import {Fragment, Router} from "./kameleon-jsx";
import {Logo} from "./widgets/logo";
import {NavItem, NavList} from "./widgets";


window.addEventListener("load", main);

function main() {
  console.log("starting!");

  const render = (
    <div>
      <Logo/>
      <Router key="navbar" hash={["worldmaps", "citymaps", "parties", "encounters"]} always>
        {() => (
          <Fragment>
            <NavList>
              <NavItem href="#worldmaps">WORLĐ MAPS</NavItem>
              <NavItem href="#citymaps">CITY MAPS</NavItem>
              <NavItem href="#parties">PARTIES</NavItem>
              <NavItem href="#encounters">ENCOUNTERS</NavItem>
            </NavList>
          </Fragment>
        )}
      </Router>
      <Router key="worldmaps" hash={"worldmaps"}>
        WORLD MAPS
      </Router>
      <Router key="citymaps" hash={"citymaps"}>
        CITY MAPS
      </Router>
      <Router key="home" hash={["worldmaps", "citymaps", "parties", "encounters"]} none>
        HOME
      </Router>
    </div>
  );

  const root = document.getElementById("root");
  root.innerHTML = "";
  root.appendChild(render);
}

