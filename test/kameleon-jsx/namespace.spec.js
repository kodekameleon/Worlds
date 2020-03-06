import {expect} from "chai";

import {getNamespaceUri} from "../../src/kameleon-jsx/namespaces";

describe("CreateJSX namespaces:", () => {
  it("should return the correct namespace URI", () => {
    expect(getNamespaceUri("svg:path")).to.deep.equal({nsUri: "http://www.w3.org/2000/svg", tag: "path"});
  });

  it("should return {} if no namespace is present", () => {
    expect(getNamespaceUri("path")).to.deep.equal({});
  });

  it("should throw an error if an undefined namespace is given", () => {
    expect(() => getNamespaceUri("path:blah")).to.throw("Invalid namespace tag path");
  });
});

