import {appendJSX} from "../../kameleon-jsx";
import {Spline} from "../../view/spline";
import {Point, PointType} from "../../maths";

export class PointsInputMethod {
  constructor(svg) {
    this.svg = svg;
    this.points = null;
    this.spline = null;
    this.x = 0;
    this.y = 0;
  }

  onInputEvent(event) {
    switch(event.type) {
      case "click": {
        if (!this.points) {
          this.points = [];
          this.x = event.offsetX;
          this.y = event.offsetY;
        }

        if (this.spline) {
          this.spline.remove();
        }

        const point = new Point(this.x, this.y, event.shiftKey ? PointType.CORNER : PointType.CURVED);
        if (this.points.length >= 2 && point.isNear(this.points[0])) {
          // Clicking on the start point will close the shape. Make sure the start point and end
          // point are the same type.
          this.points[0].type = point.type;
          appendJSX(this.svg, <Spline points={this.points} closed/>);
          document.exitPointerLock();
        } else if (this.points.length >= 2 && point.isNear(this.points[this.points.length - 1])) {
          // Clicking on the last point will finalize the shape as a spline.
          appendJSX(this.svg, <Spline points={this.points}/>);
          document.exitPointerLock();
        } else {
          this.points.push(point);
          this.spline = <Spline points={this.points} editing/>;
          appendJSX(this.svg, this.spline);
          this.svg.parentElement.requestPointerLock();
          console.log(event);
        }
        break;
      }

      case "pointermove":
        if (this.points) {
          const points = this.points.slice();
          this.x = Math.min(Math.max(this.x + event.movementX, 0), this.svg.parentElement.offsetWidth);
          this.y = Math.min(Math.max(this.y + event.movementY, 0), this.svg.parentElement.offsetHeight);
          points.push(new Point(this.x, this.y,event.shiftKey ? PointType.CORNER : PointType.CURVED));
          this.spline.remove();
          this.spline = <Spline points={points} editing/>;
          appendJSX(this.svg, this.spline);
        }
        break;

      case "pointerlockexited":
        this.spline.remove();
        this.points = undefined;
        this.spline = undefined;
        break;

      default:
        console.log(`Unknown event type: ${event.type}`);
        console.log(event);
        break;
    }
  }
}
