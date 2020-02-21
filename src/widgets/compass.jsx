import {svgns} from "../kameleon-jsx";

export function Compass() {
  return (
    <div class="compass">
      <svgns:svg>
        <svgns:defs>
          <svgns:filter id="compass-shadow" x="-25%" y="-25%" width="150%" height="150%">
            <svgns:feColorMatrix result="matrixOut" in="SourceAlpha" type="matrix"
                           values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .6 0" />
            <svgns:feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="3" />
          </svgns:filter>
        </svgns:defs>

        <svgns:g className="shadow" style="transform:translate(2px,2px)">
          <svgns:g className="rotator" style={"filter:url(#compass-shadow)"}>
            <svgns:circle className="ring" cx={"0"} cy={"0"} r={"24"}/>
            <svgns:path className="arrow" d={
              "M -8 -24 L 0 -38 L 8 -24 L 0 0 Z" +
              "M 0 12 L 8 24 L 0 36 L -8 24 Z" +
              "M 12 0 L 24 8 L 36 0 L 24 -8 Z" +
              "M -12 0 L -24 8 L -36 0 L -24 -8 Z"}/>
          </svgns:g>
        </svgns:g>

        <svgns:g className="rotator">
          <svgns:circle className="ring grabbable" cx={"0"} cy={"0"} r={"24"}/>
          <svgns:path className="arrow grabbable" d={
            "M -8 -24 L 0 -38 L 8 -24 L 0 0 Z" +
            "M 0 12 L 8 24 L 0 36 L -8 24 Z" +
            "M 12 0 L 24 8 L 36 0 L 24 -8 Z" +
            "M -12 0 L -24 8 L -36 0 L -24 -8 Z"}/>
          <svgns:text x="0" y="-23">N</svgns:text>
          <svgns:text x="0" y="24">S</svgns:text>
          <svgns:text x="24" y="0">E</svgns:text>
          <svgns:text x="-24" y=".7">W</svgns:text>
        </svgns:g>
      </svgns:svg>
    </div>);
}
