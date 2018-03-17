const fs = require("fs-extra");
const getConfig = require("./get_config");

const {
  TINPIG_DIR,
  CONFIG_FILE,
  TEMPLATES_DIR,
  SAMPLE_PROJECTS,
  DEFAULT_CONFIG,
} = require("./constants");

function setup(callback) {
  fs.ensureDir(TEMPLATES_DIR)
    .then(() => {
      getConfig(callback);
    })
    .catch((err) => {
      console.log(`Unable to set up configuration directory at ${TINPIG_DIR}`);
      console.log(err);
    });
}


module.exports = setup;
