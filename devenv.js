// This file will be included in the final bundle when building without the CI env variable

console.log(`In developer mode, profile=${profile}`);

import {Services} from "./src/controller/api/services";

// This will be set to the current profile during build
const profile = "$$PROFILE$$";

const SERVICE_PATHS = {
  character: "http://localhost:8002",

  kodekameleon: {},
  web: {
    character: "https://character.api.kodekameleon.net",
  }
};

// Apply the current profile
Object.assign(SERVICE_PATHS, SERVICE_PATHS[profile]);

// Update any functions that need to be changed
Services.getServiceUri = getServiceUri;

function getServiceUri(service, resource) {
  return `${SERVICE_PATHS[service]}/v1/${resource}`;
}

export default {
  init: () => {
    // At this point all of the code has been loaded and initialized.
  },
};

