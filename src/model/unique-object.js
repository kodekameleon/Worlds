import {Language} from "../utils";

export function UniqueObject(state, copyFrom) {
  const self = {
    uniqueId: null,
    name: null
  };
  Language.assignOverwrite(self, copyFrom);

  return {
    get uniqueId() { return self.uniqueId; },
    get name() { return self.name; },
    set name(v) { self.name = v; }
  };
}
