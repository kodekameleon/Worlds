import {openSpline} from "../maths/spline";
import {svgns} from "../kameleon-jsx";
import {Fragment} from "../kameleon-jsx";

export function Spline(props) {
  const {px, py} = openSpline(props.points);
  return (
    <Fragment>
      {props.points.length > 0 && props.points.map((v, i, a) => i < a.length - 1
        ? <svgns:path stroke="black" fill="transparent"
                      d={`M ${v[0]} ${v[1]} C ${px.p1[i]} ${py.p1[i]} ${px.p2[i]} ${py.p2[i]} ${a[i + 1][0]} ${a[i + 1][1]}`}/>
        : undefined)}
    </Fragment>
  );
}
