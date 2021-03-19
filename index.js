const def = require("./dist/api").default;
const lib = require("./dist/api");

module.exports = Object.assign(def, lib);
