import "./layout.css";

export function Table(props, children) {
  return (
    <div class={"table"} props={props}>
      {children}
    </div>
  );
}

export function Row(props, children) {
  return (
    <div
      class={[
        "row",
        props.top && "top",
        props.center && "center",
        props.baseline && "baseline",
        props.bottom && "bottom",
        props.even && "even",
        props.padded && "padded",
        props.table && "table",
        props.class]}
      props={props}
    >
      {children}
    </div>
  );
}

export function Col(props, children) {
  return (
    <div
      class={[
        "col",
        props.left && "left",
        props.center && "center",
        props.right && "right",
        props.padded && "padded",
        props.class]}
      props={props}
    >
      {children}
    </div>
  );
}
