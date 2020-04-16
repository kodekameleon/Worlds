import _ from "lodash";
import "./icon.css";

export function Icon(props) {
  return <div
    class={["icon", props.class, props.hoverEffect, props.enabled === undefined ? undefined : props.enabled ? "enabled" : "disabled"]}
    props={_.omit(props, ["enabled"])}/>;
}
