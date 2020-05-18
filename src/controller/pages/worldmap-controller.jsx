import {PointsInputMethod} from "../input-methods/points-input";
import {svgns} from "../../kameleon-jsx";
import {Compass, ScrollPad, Zoom} from "../../widgets";
import {Grid, GridTypes} from "../../view/grid";

import "./worldmap-controller.css";

export function WorldMapController() {
  const parentdiv = (
    <div id="worldmap-controller">
      <div class="worldmap-layers" tabindex="0"
           on:click={onInputEvent} on:pointermove={onInputEvent} on:keydown={onKeyDown}
           on:pointerlockexited={onInputEvent}>
        <svgns:svg id="worldmap-svg" xmlns="http://www.w3.org/2000/svg">
        </svgns:svg>
        <svgns:svg id="overlay-svg" xmlns="http://www.w3.org/2000/svg">
          <Grid mode={GridTypes.HEX}/>
        </svgns:svg>
        <div id="worldmap-widgets">
          <Compass/>
          <ScrollPad/>
          <Zoom/>
        </div>
      </div>
    </div>
  );

  const maindiv = parentdiv.firstChild;
  const mainsvg = maindiv.firstChild;

  maindiv.focus();

  const inputMethod = new PointsInputMethod(mainsvg);

  return parentdiv;

  function onInputEvent(event) {
    inputMethod.onInputEvent(event);
  }

  function onKeyDown(event) {
    console.log(event);
    switch(event.code) {
      case "ArrowLeft":
        parentdiv.scrollBy({left: 500, top: 0, behavior: "smooth"});
        break;

      case "ArrowRight":
        parentdiv.scrollBy(-500, 0);
        break;

      case "ArrowUp":
        parentdiv.scrollBy(0, 500);
        break;

      case "ArrowDown":
        parentdiv.scrollBy(0, -500);
        break;

      default:
        console.log(event);
    }
  }
}

