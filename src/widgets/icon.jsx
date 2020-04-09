import "./icon.css";

export function Icon(props) {
  return <div class={["icon", props.class, props.hoverEffect]} props={props}/>;
}
