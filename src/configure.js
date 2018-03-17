const fs = require("fs-extra");
const getConfig = require("./get_config");

const {
  TINPIG_DIR,
  CONFIG_FILE,
  TEMPLATES_DIR,
  SAMPLE_PROJECTS,
  DEFAULT_CONFIG,
} = require("./constants");

function configure() {
  return new Promise((resolve, reject) => {
    fs.ensureDir(TEMPLATES_DIR)
      .then(() => {
        return getConfig();
      })
      .then((config) => {
        resolve(config);
      })
      .catch((err) => {
        reject(`Unable to set up configuration directory at ${TINPIG_DIR}`);
      });
  });
}


module.exports = configure;
