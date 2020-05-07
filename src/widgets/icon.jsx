import {PopupTip} from "./popup-tip";
import "./icon.css";

export function Icon(props) {
  return <div
    class={["icon", props.hoverEffect, props.enabled !== undefined && (props.enabled ? "enabled" : "disabled")]}
    glyph={props.glyph}
    props={props}>
    {props.tip && <PopupTip above>{props.tip}</PopupTip>}
  </div>;
}
