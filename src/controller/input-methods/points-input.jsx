import {Spline} from "../../view/spline";
import {appendJSX} from "../../kameleon-jsx";

export class PointsInputMethod {
  constructor(svg) {
    this.svg = svg;
    this.points = null;
    this.path = null;
    this.x = 0;
    this.y = 0;
  }

  onInputEvent(event) {

    switch(event.type) {
      case "pointerup":
        if (!this.points) {
          this.points = [];
          this.x = event.offsetX;
          this.y = event.offsetY;
        }
        this.points.push([this.x, this.y]);
        const spline = <Spline points={this.points}/>; //eslint-disable-line
        this.svg.innerHTML = "";
        appendJSX(this.svg, spline);
        this.svg.parentElement.requestPointerLock();
        console.log(event);
        break;

      case "pointermove":
        if (this.points) {
          const points = this.points.slice();
          console.log(`x,y=${event.offsetX},${event.offsetY}`);
          this.x = Math.min(Math.max(this.x + event.movementX, 0), this.svg.parentElement.offsetWidth);
          this.y = Math.min(Math.max(this.y + event.movementY, 0), this.svg.parentElement.offsetHeight);
          points.push([this.x, this.y]);
          const spline = <Spline points={points}/>;
          this.svg.innerHTML = "";
          appendJSX(this.svg, spline);
        }
        break;

      case "pointerlockexited":
        this.points = undefined;
        this.svg.innerHTML = "";
        break;

      default:
        console.log(`Unknown event type: ${event.type}`);
        console.log(event);
        break;
    }
  }
}
