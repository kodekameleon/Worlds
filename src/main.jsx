import {Fragment, renderApp, Router} from "./kameleon-jsx";
import {Logo} from "./widgets/logo";
import {NavItem, NavList} from "./widgets";
import {WorldMapController} from "./controller/pages/worldmap-controller";


window.addEventListener("load", main);

function main() {
  console.log("starting!");

  // Send pointer unlock messages back to the element that has the lock
  let lockedElement;
  document.addEventListener("pointerlockchange", () => {
    if (lockedElement && !document.pointerLockElement) {
      lockedElement.dispatchEvent(new Event("pointerlockexited"));
    }
    lockedElement = document.pointerLockElement;
  });

  const app = (
    <Fragment>
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
        {() => (WorldMapController)}
      </Router>
      <Router hash={"citymaps"}>
        CITY MAPS
      </Router>
      <Router hash={["worldmaps", "citymaps", "parties", "encounters"]} none>
        HOME
      </Router>
    </Fragment>
  );

  renderApp(app);
}
