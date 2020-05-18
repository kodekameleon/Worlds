import {expect} from "chai";
import {PopupTip} from "../../src/widgets/popup-tip";

describe("PopupTip", () => {
  it("should render the popup tip in default position", () => {
    const icon = (<PopupTip>This is the tip</PopupTip>);
    expect(icon.outerHTML).to.equal("<div class=\"popup-tip-container below\"><div class=\"popup-tip\">This is the tip</div></div>");
  });

  it("should render the popup tip on the left", () => {
    const icon = (<PopupTip left>This is the tip</PopupTip>);
    expect(icon.outerHTML).to.equal("<div class=\"popup-tip-container left\"><div class=\"popup-tip\">This is the tip</div></div>");
  });

  it("should render the popup tip on the right", () => {
    const icon = (<PopupTip right>This is the tip</PopupTip>);
    expect(icon.outerHTML).to.equal("<div class=\"popup-tip-container right\"><div class=\"popup-tip\">This is the tip</div></div>");
  });

  it("should render the popup tip above", () => {
    const icon = (<PopupTip above>This is the tip</PopupTip>);
    expect(icon.outerHTML).to.equal("<div class=\"popup-tip-container above\"><div class=\"popup-tip\">This is the tip</div></div>");
  });

  it("should render the popup tip below", () => {
    const icon = (<PopupTip below>This is the tip</PopupTip>);
    expect(icon.outerHTML).to.equal("<div class=\"popup-tip-container below\"><div class=\"popup-tip\">This is the tip</div></div>");
  });
});
