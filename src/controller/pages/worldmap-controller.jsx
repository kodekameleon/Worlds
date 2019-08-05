import {svgns} from "../../kameleon-jsx";
import {closedSpline} from "../../maths/spline";
import {PointsInputMethod} from "../input-methods/points-input";
import {Grid, GridTypes} from "../../view/grid";

export function WorldMapController() {
  const parentdiv = (
    <div class="worldmap-controller">
      <div class="worldmap-layers"
           onpointerdown={onInputEvent} onpointerup={onInputEvent} onpointermove={onInputEvent}
           onkeydown={onKeyDown} tabIndex="0">
        <svgns:svg id="worldmap-svg" xmlns="http://www.w3.org/2000/svg">
        </svgns:svg>
        <svgns:svg id="overlay-svg" xmlns="http://www.w3.org/2000/svg">
          <Grid mode={GridTypes.HEX}/>
        </svgns:svg>
      </div>
    </div>
  );

  const maindiv = parentdiv.firstChild;
  const mainsvg = maindiv.firstChild;

  maindiv.addEventListener("pointerlockexited", onInputEvent); // TODO support custom events
  //  document.addEventListener("keydown", onKeyDown); // TODO support custom events
  maindiv.focus();

  const inputMethod = new PointsInputMethod(mainsvg);

  // const points = [[60, 160], [220, 400], [420, 400], [700, 340], [600, 200], [540, 350], [330, 490]];
  const points = [[60, 160], [220, 400], [389, 342], [700, 340], [600, 200], [474, 387], [330, 490]];
  const {px, py} = closedSpline(points);

  let i;
  for (i = 0; i < points.length - 1; ++i) {
    mainsvg.append(
      <svgns:path d={`M ${points[i][0]} ${points[i][1]} C ${px.p1[i]} ${py.p1[i]} ${px.p2[i]} ${py.p2[i]} ${points[i+1][0]} ${points[i+1][1]}`}
                stroke="black" fill="transparent"/>);
  }
  mainsvg.append(
    <svgns:path d={`M ${points[i][0]} ${points[i][1]} C ${px.p1[i]} ${py.p1[i]} ${px.p2[i]} ${py.p2[i]} ${points[0][0]} ${points[0][1]}`}
              stroke="black" fill="transparent"/>);

  for (let i = 0; i < points.length; ++i) {
    mainsvg.append(
      <svgns:circle cx={points[i][0]} cy={points[i][1]} r="4" stroke="blue" fill="transparent"/>);
  }

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

