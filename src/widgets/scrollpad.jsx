import {svgns} from "../kameleon-jsx";
import "./scrollpad.css";

export function ScrollPad() {
  return (
    <div class="arrowpad">
      <svgns:svg>
        <svgns:defs>
          <svgns:filter id="arrowpad-shadow" x="-25%" y="-25%" width="150%" height="150%">
            <svgns:feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
            <svgns:feColorMatrix result="matrixOut" in="offOut" type="matrix"
                                 values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .6 0"/>
            <svgns:feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="3"/>
            <svgns:feBlend result="blendOut" in2="blurOut" in="SourceGraphic"/>
          </svgns:filter>
        </svgns:defs>

        <svgns:g  style={"filter:url(#arrowpad-shadow)"}>
          <svgns:path class="arrow" d={"M -32 0 L -12 -10 L -12 10 Z"}/>
          <svgns:path class="arrow" d={"M 32 0 L 12 -10 L 12 10 Z"}/>
          <svgns:path class="arrow" d={"M 0 -32 L -10 -12 L 10 -12 Z"}/>
          <svgns:path class="arrow" d={"M 0 32 L -10 12 L 10 12 Z"}/>

          <svgns:path class="center" d={
            "M -8 -1 L -1 -1 L -1 -8" +
            "M 8 -1 L 1 -1 L 1 -8" +
            "M -8 1 L -1 1 L -1 8" +
            "M 8 1 L 1 1 L 1 8"
          }/>
        </svgns:g>
      </svgns:svg>
    </div>);
}
