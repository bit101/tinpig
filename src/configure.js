const fs = require("fs-extra");

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
      .then(getConfig)
      .then(config => resolve(config))
      .catch(err => reject(`Unable to set up tinpig directory at ${TINPIG_DIR}`));
  });
}

function getConfig() {
  return new Promise((resolve, reject) => {
    fs.pathExists(CONFIG_FILE)
      .then(exists => {
        if(exists) {
          return readConfig();
        } else {
          return createConfig();
        }
      })
      .then(config => resolve(config))
      .catch(err => reject(`Unable to verify configuration file at ${CONFIG_FILE}`));
  });
}

function readConfig() {
  return new Promise((resolve, reject) => {
    fs.readJSON(CONFIG_FILE)
      .then(config => resolve(config))
      .catch(err => reject(`Unable to read configuration file at ${CONFIG_FILE}`));
  });
}

function createConfig() {
  return new Promise((resolve, reject) => {
    fs.writeJSON(CONFIG_FILE, DEFAULT_CONFIG, { spaces: 2 })
      .then(() => resolve(DEFAULT_CONFIG))
      .catch(err => reject(`Unable to create configuration file at ${CONFIG_FILE}`));
  });
}


module.exports = configure;
