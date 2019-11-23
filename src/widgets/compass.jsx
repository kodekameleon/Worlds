import {svgns} from "../kameleon-jsx";

/*
        <svgns:path d={"m 100 52 A 48 48 0 0 1 148 100"} stroke-width={"4"} stroke={"green"}/>
        <svgns:path d={"m 148 100 A 48 48 0 0 1 100 148"} stroke-width={"4"} stroke={"purple"}/>
        <svgns:path d={"m 100 148 A 48 48 0 0 1 52 100"} stroke-width={"4"} stroke={"orange"}/>
        <svgns:path d={"m 52 100 A 48 48 0 0 1 100 52"} stroke-width={"4"} stroke={"pink"}/>

 */
export function Compass() {
  return (
    <div class="compass">
      <svgns:svg>
        <svgns:path class="ring" d={
          "M 52.6 92 A 47 47 0 0 1 92 52.6" +
          "M 108 52.6 A 47 47 0 0 1 147.4 92" +
          "M 147.4 108 A 47 47 0 0 1 108 147.4" +
          "M 92 147.4 A 47 47 0 0 1 52.6 108"}/>
        <svgns:path class="arrow" d={"M 92 52.6 L 100 32 L 108 52.6 L 100 100 L 92 52.6"}/>
        <svgns:text y="54" x="100">N</svgns:text>
        <svgns:text y="100" x="148">E</svgns:text>
        <svgns:text y="148" x="100">S</svgns:text>
        <svgns:text y="100" x="52">W</svgns:text>
      </svgns:svg>
    </div>);
}
