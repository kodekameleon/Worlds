"use strict";

/* eslint-disable no-undef */
require("mocha");
//require("dotenv/config");

// Set up chai extensions
const chai = require("chai");
chai.config.includeStack = true;

chai.use(require("sinon-chai"));
chai.use(require("chai-as-promised"));
/* eslint-enable no-undef */
