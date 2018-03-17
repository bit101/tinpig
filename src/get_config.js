const fs = require("fs-extra");

const {
  DEFAULT_CONFIG,
  CONFIG_FILE,
} = require("./constants");

function getConfig(callback) {
  fs.pathExists(CONFIG_FILE)
    .then((exists) => {
      if(exists) {
        readConfig(callback);
      } else {
        createConfig(callback);
      }
    })
    .catch((err) => {
      console.log(`Unable to verify configuration file at ${CONFIG_FILE}`);
      console.log(err);
    });
}

function readConfig(callback) {
    fs.readJSON(CONFIG_FILE)
      .then((config) => {
        callback(config);
      })
      .catch((err) => {
        console.log(`Unable to read configuration file at ${CONFIG_FILE}`);
        console.log(err);
      });
}

function createConfig(callback) {
    fs.writeJSON(CONFIG_FILE, DEFAULT_CONFIG, { spaces: 2 })
      .then(() => {
        callback(DEFAULT_CONFIG);
      })
      .catch((err) => {
        console.log(`Unable to create configuration file at ${CONFIG_FILE}`);
        console.log(err);
      });
}


module.exports = getConfig;
