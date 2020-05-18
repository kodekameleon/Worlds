import {svgns} from "../kameleon-jsx";
import "./zoom.css";

export function Zoom() {
  const [a, b] = ["a", "b"];
  console.log(a);
  console.log(b);
  return (
    <div class="zoom">
      <svgns:svg>
        <svgns:defs>
          <svgns:filter id="zoom-shadow" x="-25%" y="-25%" width="150%" height="150%">
            <svgns:feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
            <svgns:feColorMatrix result="matrixOut" in="offOut" type="matrix"
                                 values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .6 0"/>
            <svgns:feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="3"/>
            <svgns:feBlend result="blendOut" in2="blurOut" in="SourceGraphic"/>
          </svgns:filter>
        </svgns:defs>

        <svgns:g>
          <svgns:circle cx={"-12"} cy={"12"} r={"8"}/>
          <svgns:path d={"M -6 18 L 2 26 "}/>
        </svgns:g>
      </svgns:svg>
    </div>);
}
