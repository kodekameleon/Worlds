/**
 * @namespace Language
 *
 * Helpers that deal with various aspects of the language
 */
export const Language = {

  /**
   * Compose the properties of a set of objects into a target object. This will not
   * resolve getters/setters, but instead copy them. Apart from that, this function
   * is equivalent to Object.assign().
   *
   * @param target      The target object to compose the other objects into
   * @param ...sources  The source object(s) to compose into the target object
   * @returns {*}       The composed object, this is simply the target
   */
  compose(target, ...sources) {
    for (const source of sources) {
      for (const prop in source) {
        Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
      }
    }
    return target;
  }
};
