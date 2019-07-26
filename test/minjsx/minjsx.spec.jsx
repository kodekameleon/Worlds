import {minjsx} from "../../src/minjsx/minjsx";

describe("MinJSX tests", () => {
  it("should create elements", () => {
    const res = minjsx("div");
    console.log(`res=${res}//${JSON.stringify(res)}`);
  });

  it("should create html div", () => {
    const res = (<div/>);
    console.log(`res=${res}//${JSON.stringify(res)}`);
  });
});

