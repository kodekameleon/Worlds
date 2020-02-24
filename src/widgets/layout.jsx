
export function Row(props, children) {
  props = props || {};
  const classes=["row", props.center && "center", props.even && "even", props.class];
  console.log(classes);
  return (
    <div
      class={`row${props && props.center ? " center" : ""}${props && props.even ? " even" : ""}`}
      addClass={props && props.class && props.class}>
      {children}
    </div>
  );
}

export function Col(props, children) {
  return (
    <div
      class={`col${props && props.center ? " center" : "" }`}
      addClass={props && props.class ? props.class : ""}>
      {children}
    </div>
  );
}
