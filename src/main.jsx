import {Fragment, renderApp, Route} from "./kameleon-jsx";
import {Logo} from "./widgets/logo";
import {NavItem, NavList} from "./widgets";
import {WorldMapController} from "./controller/pages/worldmap-controller";
import {EncountersController} from "./controller/pages/encounters-controller";
import {CardsController} from "./controller/pages/cards-controller";

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
        <Fragment>
          <NavList>
            <NavItem href="#worldmaps">WORLĐ MAPS</NavItem>
            <NavItem href="#citymaps">CITY MAPS</NavItem>
            <NavItem href="#parties">PARTIES</NavItem>
            <NavItem href="#encounters">ENCOUNTERS</NavItem>
            <NavItem href="#cards">CARĐS</NavItem>

            <li/>
          </NavList>
        </Fragment>
      </div>
      <Route hash={"worldmaps"}>
        {() => (WorldMapController)}
      </Route>
      <Route hash={"citymaps"}>
        CITY MAPS
      </Route>
      <Route hash={"encounters"}>
        {() => (EncountersController)}
      </Route>
      <Route hash={"cards"}>
        {() => (CardsController)}
      </Route>
      <Route hash={["worldmaps", "citymaps", "parties", "encounters", "cards"]} none>
        HOME
      </Route>
    </Fragment>
  );

  renderApp(app);
}
