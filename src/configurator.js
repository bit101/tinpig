const fs = require("fs-extra");

const { CONFIG_FILE, TEMPLATES_DIR } = require("./constants");

const DEFAULT_CONFIG = {
};

class Configurator {
  configure() {
    return fs.ensureDir(TEMPLATES_DIR)
      .then(() => this.getConfig());
  }

  getConfig() {
    return fs.pathExists(CONFIG_FILE)
      .then((exists) => {
        if (exists) {
          return this.readConfig();
        }
        return this.createConfig();
      });
  }

  readConfig() {
    return fs.readJSON(CONFIG_FILE);
  }

  createConfig() {
    return fs.writeJSON(CONFIG_FILE, DEFAULT_CONFIG, { spaces: 2 })
      .then(() => DEFAULT_CONFIG);
  }
}

module.exports = Configurator;
