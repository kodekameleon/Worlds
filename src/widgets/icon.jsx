import _ from "lodash";
import {PopupTip} from "./popup-tip";
import "./icon.css";

export function Icon(props) {
  return <div
    class={["icon", props.class, props.hoverEffect, props.enabled === undefined ? undefined : props.enabled ? "enabled" : "disabled"]}
    props={_.omit(props, ["enabled", "tip"])}>
    {props.tip && <PopupTip top>{props.tip}</PopupTip>}
  </div>;
}
