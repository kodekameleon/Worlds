import "./popup-tip.css";

export function PopupTip(props, children) {
  let side = "bottom";
  if (props.left) {
    side = "left";
  } else if (props.top) {
    side = "top";
  } else if (props.right) {
    side = "right";
  }
  return (
    <div class={["popup-tip-container", side]}>
      <div class={["popup-tip", side]} props={props}>{children}</div>
    </div>
  );
}
