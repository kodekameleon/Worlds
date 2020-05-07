import {expect} from "chai";
import {Col, Row, Table} from "../../src/widgets";

describe("Layout Tests", () => {
  describe("Table tests", () => {
    it("should render the table", () => {
      const el = (<Table/>);
      expect(el.outerHTML).to.equal("<div class=\"table\"></div>");
    });

    it("should render the table with children", () => {
      const el = (<Table><div></div></Table>);
      expect(el.outerHTML).to.equal("<div class=\"table\"><div></div></div>");
    });

    it("should render the table with props", () => {
      const el = (<Table class="abc"></Table>);
      expect(el.outerHTML).to.equal("<div class=\"table abc\"></div>");
    });
  });

  describe("Row tests", () => {
    it("should render the row", () => {
      const el = (<Row/>);
      expect(el.outerHTML).to.equal("<div class=\"row\"></div>");
    });

    it("should render the row with children", () => {
      const el = (<Row><div></div></Row>);
      expect(el.outerHTML).to.equal("<div class=\"row\"><div></div></div>");
    });

    it("should render the row with props", () => {
      const el = (<Row class="abc"></Row>);
      expect(el.outerHTML).to.equal("<div class=\"row abc\"></div>");
    });

    it("should render the row with top", () => {
      const el = (<Row top></Row>);
      expect(el.outerHTML).to.equal("<div class=\"row top\"></div>");
    });

    it("should render the row with center", () => {
      const el = (<Row center></Row>);
      expect(el.outerHTML).to.equal("<div class=\"row center\"></div>");
    });

    it("should render the row with baseline", () => {
      const el = (<Row baseline></Row>);
      expect(el.outerHTML).to.equal("<div class=\"row baseline\"></div>");
    });

    it("should render the row with bottom", () => {
      const el = (<Row bottom></Row>);
      expect(el.outerHTML).to.equal("<div class=\"row bottom\"></div>");
    });

    it("should render the row with even", () => {
      const el = (<Row even></Row>);
      expect(el.outerHTML).to.equal("<div class=\"row even\"></div>");
    });

    it("should render the row with padded", () => {
      const el = (<Row padded></Row>);
      expect(el.outerHTML).to.equal("<div class=\"row padded\"></div>");
    });

    it("should render the row with table", () => {
      const el = (<Row table></Row>);
      expect(el.outerHTML).to.equal("<div class=\"row table\"></div>");
    });

    it("should render the row with multiple options", () => {
      const el = (<Row top center baseline bottom even padded table></Row>);
      expect(el.outerHTML).to.equal("<div class=\"row top center baseline bottom even padded table\"></div>");
    });
  });

  describe("Col tests", () => {
    it("should render the col", () => {
      const el = (<Col/>);
      expect(el.outerHTML).to.equal("<div class=\"col\"></div>");
    });

    it("should render the col with children", () => {
      const el = (<Col><div></div></Col>);
      expect(el.outerHTML).to.equal("<div class=\"col\"><div></div></div>");
    });

    it("should render the col with props", () => {
      const el = (<Col class="abc"></Col>);
      expect(el.outerHTML).to.equal("<div class=\"col abc\"></div>");
    });

    it("should render the col with top", () => {
      const el = (<Col left></Col>);
      expect(el.outerHTML).to.equal("<div class=\"col left\"></div>");
    });

    it("should render the col with center", () => {
      const el = (<Col center></Col>);
      expect(el.outerHTML).to.equal("<div class=\"col center\"></div>");
    });

    it("should render the col with baseline", () => {
      const el = (<Col right></Col>);
      expect(el.outerHTML).to.equal("<div class=\"col right\"></div>");
    });

    it("should render the col with padded", () => {
      const el = (<Col padded></Col>);
      expect(el.outerHTML).to.equal("<div class=\"col padded\"></div>");
    });

    it("should render the col with multiple options", () => {
      const el = (<Col left center right padded></Col>);
      expect(el.outerHTML).to.equal("<div class=\"col left center right padded\"></div>");
    });
  });
});
