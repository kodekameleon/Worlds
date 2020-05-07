import "./popup-tip.css";

export function PopupTip(props, children) {
  let side = "below";
  if (props.left) {
    side = "left";
  } else if (props.above) {
    side = "above";
  } else if (props.right) {
    side = "right";
  }
  return (
    <div class={["popup-tip-container", side]}>
      <div class={"popup-tip"} props={props}>{children}</div>
    </div>
  );
}
