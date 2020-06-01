// This file will be included in the final bundle when building without the CI env variable

const profile = "$$PROFILE$$";
console.log(`profile=${profile}`);

export default {
  default: {
    services: {
      "character-service": "http://localhost:xxx",
      "other-service": "blah",
      "other-service2": "blah"
    }
  },
  kodekameleon: {
    services: {
      "character-service": "http://localhost:8001",
      "other-service2": undefined
    }
  }
};
