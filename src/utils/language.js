/**
 * Language
 *
 * Helpers that deal with various aspects of the language
 */
export class Language {
  /**
   * Compose the properties of a set of objects into a target object. This will not
   * resolve getters/setters, but instead copy them. Apart from that, this function
   * is equivalent to Object.assign().
   *
   * @param target      The target object to compose the other objects into
   * @param ...sources  The source object(s) to compose into the target object
   * @returns {*}       The composed object, this is simply the target
   */
  static compose(target, ...sources) {
    for (const source of sources) {
      for (const prop in source) {
        Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
      }
    }
    return target;
  }

  /**
   * Returns a new deep copy of the object with any null values removed. This is useful during
   * serialization to remove any null values, assuming that objects are initialized with null
   * values for default values.
   * @param obj
   */
  static deflate(obj) {
    const deflated = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const v = obj[key];
        if (v && v.constructor.name === "Object") {
          const child = Language.deflate(v);
          if (Object.keys(child).length > 0) {
            deflated[key] = child;
          }
        } else if (v !== undefined && v !== null && (!Array.isArray(v) || v.length > 0)) {
          deflated[key] = v;
        }
      }
    }
    return deflated;
  }

  /**
   * Performs a deep copy of source into target, but only copying fields that already exist in the target.
   * @param target
   * @param source
   * @returns {*} Returns the target object
   */
  static assignOverwrite(target, source) {
    if (source) {
      for (const key in target) {
        if (target.hasOwnProperty(key) && source.hasOwnProperty(key)) {
          if (target[key] && target[key].constructor.name === "Object") {
            Language.assignOverwrite(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  }
}
