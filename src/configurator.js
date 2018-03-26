const fs = require("fs-extra");

const { CONFIG_FILE, TINPIG_DIR } = require("./constants");

const DEFAULT_CONFIG = {
  templatesDir: `${TINPIG_DIR}/templates`,
};

class Configurator {
  configure() {
    this.getConfig()
      .then(config => this.setConfig(config))
      .then(() => fs.ensureDir(this.config.templatesDir))
      .then(() => this.config);
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
