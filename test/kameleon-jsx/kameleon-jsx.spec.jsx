import {createJSX} from "../../src/kameleon-jsx/create-jsx";

describe("MinJSX tests", () => {
  it("should create elements", () => {
    const res = createJSX("div");
    console.log(`res=${res}//${JSON.stringify(res)}`);
  });

  it("should create html div", () => {
    const res = (<div/>);
    console.log(`res=${res}//${JSON.stringify(res)}`);
  });
});

