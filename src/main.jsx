import {renderApp, Route} from "./kameleon-jsx";
import {Logo} from "./widgets/logo";
import {NavItem, NavList} from "./widgets";
import {WorldMapController} from "./controller/pages/worldmap-controller";
import {EncountersController} from "./controller/pages/encounters-controller";
import {CardsController} from "./controller/pages/cards-controller";
import {PartiesController} from "./controller/pages/parties-controller";

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
