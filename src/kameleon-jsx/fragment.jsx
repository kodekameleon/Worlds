/**
 *
 * @param props
 * @param children
 * @returns {*}
 * @constructor
 */
export function Fragment(props, children) {
  // Use lower case fragment here so that JSX does not invoke Fragment to do the creation.
  return (<fragment class="fragment">{children}</fragment>);
}
