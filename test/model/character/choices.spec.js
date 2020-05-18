import {expect} from "chai";
import {Feature, FeatureSet} from "../../../src/model";

describe("Choices Model", () => {
  const choices = [
    Feature({}, {
      uniqueId: "first-choice-of-feature",
      name: "Standard Array"
    }),
    Feature({}, {
      uniqueId: "second-choice-of-feature",
      name: "Points Buy"
    }),
    Feature({}, {
      uniqueId: "feature-with-nested-choices",
      name: "Random",
      featureChoices: [
        Feature({}, {
          uniqueId: "nested-choice-1",
          name: "nested choice 1"
        }),
        Feature({}, {
          uniqueId: "nested-choice-2",
          name: "nested choice 2"
        })
      ]
    })
  ];

  describe("ChoicesFeature", () => {
    it("should create a new ChoicesFeature from JSON", () => {
      const cf = Feature({}, {
        uniqueId: "root-feature",
        featureChoices: choices
      });

      expect(cf.featureChoices).to.deep.equal(choices);
    });
  });

  describe("ChoicesFeatureSet", () => {
    let featureSet;
    let choicesFeature;

    beforeEach(() => {
      choicesFeature = Feature({}, {
        uniqueId: "root-feature",
        featureChoices: choices
      });
      featureSet = FeatureSet();
      featureSet.features.featureList.push(choicesFeature);
    });

    it("should activate a choice by adding it to the feature list", () => {
      const res = featureSet.features.activateFeatureChoice("root-feature", "first-choice-of-feature");
      expect(res).to.be.true;
      expect(featureSet.features.featureList).to.have.length(2);
      expect(featureSet.features.featureList[0].uniqueId).to.equal("root-feature");
      expect(featureSet.features.featureList[1].uniqueId).to.equal("first-choice-of-feature");
    });

    it("should activate a nested choice by adding it to the feature list", () => {
      let res = featureSet.features.activateFeatureChoice("root-feature", "feature-with-nested-choices");
      expect(res).to.be.true;
      expect(featureSet.features.featureList).to.have.length(2);
      expect(featureSet.features.featureList[0].uniqueId).to.equal("root-feature");
      expect(featureSet.features.featureList[1].uniqueId).to.equal("feature-with-nested-choices");

      res = featureSet.features.activateFeatureChoice("feature-with-nested-choices", "nested-choice-2");
      expect(res).to.be.true;
      expect(featureSet.features.featureList).to.have.length(3);
      expect(featureSet.features.featureList[0].uniqueId).to.equal("root-feature");
      expect(featureSet.features.featureList[1].uniqueId).to.equal("feature-with-nested-choices");
      expect(featureSet.features.featureList[2].uniqueId).to.equal("nested-choice-2");
    });

    it("should accept strings or objects when activating a choice", () => {
      const res = featureSet.features.activateFeatureChoice(featureSet.getFeature("root-feature"), choicesFeature.featureChoices[0]);
      expect(res).to.be.true;
      expect(featureSet.features.featureList).to.have.length(2);
      expect(featureSet.features.featureList[0].uniqueId).to.equal("root-feature");
      expect(featureSet.features.featureList[1].uniqueId).to.equal("first-choice-of-feature");
    });

    it("should not activate a choice if its parent is not valid", () => {
      const res = featureSet.features.activateFeatureChoice("Blah", "first-choice-of-feature");
      expect(res).to.be.false;
      expect(featureSet.features.featureList).to.have.length(1);
      expect(featureSet.features.featureList[0].uniqueId).to.equal("root-feature");
    });

    it("should not activate a choice if its parent is not active", () => {
      const res = featureSet.features.activateFeatureChoice(choices[2], "first-choice-of-feature");
      expect(res).to.be.false;
      expect(featureSet.features.featureList).to.have.length(1);
      expect(featureSet.features.featureList[0].uniqueId).to.equal("root-feature");
    });

    it("should deactivate a choice by removing it from the feature list", () => {
      const res = featureSet.features.activateFeatureChoice("root-feature", "first-choice-of-feature");
      expect(res).to.be.true;
      expect(featureSet.features.featureList).to.have.length(2);
      expect(featureSet.features.featureList[0].uniqueId).to.equal("root-feature");
      expect(featureSet.features.featureList[1].uniqueId).to.equal("first-choice-of-feature");

      featureSet.features.deactivateFeatureChoice("root-feature");
      expect(featureSet.features.featureList).to.have.length(1);
      expect(featureSet.features.featureList[0].uniqueId).to.equal("root-feature");
    });

    it("should deactivate previous choices when activating a new a choice", () => {
      let res = featureSet.features.activateFeatureChoice("root-feature", "first-choice-of-feature");
      expect(res).to.be.true;
      expect(featureSet.features.featureList).to.have.length(2);
      expect(featureSet.features.featureList[0].uniqueId).to.equal("root-feature");
      expect(featureSet.features.featureList[1].uniqueId).to.equal("first-choice-of-feature");

      res = featureSet.features.activateFeatureChoice("root-feature", "second-choice-of-feature");
      expect(res).to.be.true;
      expect(featureSet.features.featureList).to.have.length(2);
      expect(featureSet.features.featureList[0].uniqueId).to.equal("root-feature");
      expect(featureSet.features.featureList[1].uniqueId).to.equal("second-choice-of-feature");
    });

    it("should deactivate a nested choice when the root choice is deactivated", () => {
      let res = featureSet.features.activateFeatureChoice("root-feature", "feature-with-nested-choices");
      res = featureSet.features.activateFeatureChoice("feature-with-nested-choices", "nested-choice-2");
      expect(res).to.be.true;
      expect(featureSet.features.featureList).to.have.length(3);
      expect(featureSet.features.featureList[0].uniqueId).to.equal("root-feature");
      expect(featureSet.features.featureList[1].uniqueId).to.equal("feature-with-nested-choices");
      expect(featureSet.features.featureList[2].uniqueId).to.equal("nested-choice-2");

      featureSet.features.deactivateFeatureChoice("root-feature");
      expect(featureSet.features.featureList).to.have.length(1);
      expect(featureSet.features.featureList[0].uniqueId).to.equal("root-feature");
    });

    it("should do nothing when deactivating a choice that is not active", () => {
      featureSet.features.deactivateFeatureChoice("Blah");
      expect(featureSet.features.featureList).to.have.length(1);
      expect(featureSet.features.featureList[0].uniqueId).to.equal("root-feature");
    });

    it("should return the active choice when there is one", () => {
      const res = featureSet.features.activateFeatureChoice("root-feature", "first-choice-of-feature");
      expect(res).to.be.true;
      expect(featureSet.features.featureList).to.have.length(2);
      expect(featureSet.features.featureList[0].uniqueId).to.equal("root-feature");
      expect(featureSet.features.featureList[1].uniqueId).to.equal("first-choice-of-feature");

      const active = featureSet.features.getActiveFeatureChoice("root-feature");
      expect(active.uniqueId).to.equal("first-choice-of-feature");
    });

    it("should return the nothing when there is no active choice", () => {
      const active = featureSet.features.getActiveFeatureChoice("root-feature");
      expect(active).to.undefined;
    });
  });
});
