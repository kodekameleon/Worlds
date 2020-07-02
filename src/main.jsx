import $devenv from "../devenv";
import {CardsController} from "./controller/pages/cards-controller";
import {EncountersController} from "./controller/pages/encounters-controller";
import {Logo} from "./widgets/logo";
import {PartiesController} from "./controller/pages/parties-controller";
import {WorldMapController} from "./controller/pages/worldmap-controller";
import {NavItem, NavList} from "./widgets";
import {renderApp, Route} from "./kameleon-jsx";
import "./main.css";

// If running in development mode initialize anything that needs it
$devenv.init && $devenv.init();

window.addEventListener("load", main);

function main() {
  // Send pointer unlock messages back to the element that has the lock
  let lockedElement;
  document.addEventListener("pointerlockchange", () => {
    if (lockedElement && !document.pointerLockElement) {
      lockedElement.dispatchEvent(new Event("pointerlockexited"));
    }
    lockedElement = document.pointerLockElement;
  });

  const app = (
    <>
      <div class="header">
        <Logo/>
        <NavList>
          <NavItem href="#worldmaps">WORLĐ MAPS</NavItem>
          <NavItem href="#citymaps">CITY MAPS</NavItem>
          <NavItem href="#parties">PARTIES</NavItem>
          <NavItem href="#encounters">ENCOUNTERS</NavItem>
          <NavItem href="#cards">CARĐS</NavItem>

          <li/>
        </NavList>
      </div>
      <Route hash={"worldmaps"} component={WorldMapController}/>
      <Route hash={"citymaps"}>CITY MAPS</Route>
      <Route hash={"parties"} component={PartiesController}/>
      <Route hash={"encounters"} component={EncountersController}/>
      <Route hash={"cards"} component={CardsController}/>
      <Route hash={["worldmaps", "citymaps", "parties", "encounters", "cards"]} none>
        HOME
      </Route>
    </>
  );

  renderApp(app);
}
