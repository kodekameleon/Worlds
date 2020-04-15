import {PointType} from "../maths";
import {svgns} from "../kameleon-jsx";
import {closedSpline, openSpline} from "../maths/spline";
import "./spline.css";

/**
 * @namespace View.Spline
 * @param props {Object} The properties for rendering the spline:
 * @returns {Element}
 * @constructor
 */
export function Spline(props) {
  // Get the points for the spline
  const {x, y, x1, y1, x2, y2} = props.closed ? closedSpline(props.points) : openSpline(props.points);

  // Create svg containing a path with the spline, and circles or diamonds for the points
  return (
    <svgns:svg class={["spline", props.editing && "editing"]}>
      <svgns:path class="shape"
                  d={`M ${x[0]} ${y[0]}` + x2.reduce(
                    (p, v, i) => p +
                      ` C ${x1[i].toFixed(3)} ${y1[i].toFixed(3)} ${x2[i].toFixed(3)} ${y2[i].toFixed(3)} ${x[i + 1]} ${y[i + 1]}`,
                    "")}
      />
      {
        props.points.map((pt) => (
          pt.type === PointType.CURVED
            ? <svgns:circle class="handle" cx={pt.x} cy={pt.y} r="2"/>
            : <svgns:polygon class="handle"
                             points={`${pt.x},${pt.y - 3} ${pt.x - 3},${pt.y} ${pt.x},${pt.y + 3} ${pt.x + 3},${pt.y}`}/>
        ))
      }
    </svgns:svg>
  );
}
