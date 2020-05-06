import {svgns} from "../kameleon-jsx";
import "./rough-paper.css";

export function RoughPaper(props) {
  return (
    <svgns:svg class="rough-paper" props={props}>
      <svgns:filter id='roughpaper' x='0%' y='0%' width='100%' height="100%">
        <svgns:feTurbulence type="fractalNoise" baseFrequency='0.04' result='noise' numOctaves="5"/>
        <svgns:feDiffuseLighting class="color" in='noise' surfaceScale='2'>
          <svgns:feDistantLight azimuth='45' elevation='60'/>
        </svgns:feDiffuseLighting>
      </svgns:filter>
      <svgns:rect x="0" y="0" width="100%" height="100%" filter="url(#roughpaper)" fill="none"/>
    </svgns:svg>);
}
