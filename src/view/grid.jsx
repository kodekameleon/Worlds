import {svgns} from "../kameleon-jsx";

export const GridTypes = Object.freeze({HEX: "HEX"});

export function Grid() {
  return (
    <svgns:svg id="grid-svg" xmlns="http://www.w3.org/2000/svg">
      <svgns:defs>
        <svgns:pattern id="hex-grid-pattern" x="0" y="0" width="150" height="86.6" patternUnits="userSpaceOnUse">
          <svgns:polyline points="100,43.3 75,0 25,0 0,43.3 25,86.6 75,86.6 100,43.3 150,43.3"
                          stroke="rgba(0,0,0,.05" fill={"transparent"}/>
        </svgns:pattern>
      </svgns:defs>
      <svgns:rect fill="url(#hex-grid-pattern)" stroke="none" x="0" width="10000" y="0" height="10000"/>
    </svgns:svg>
  );
}
