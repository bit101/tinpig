const fs = require("fs-extra");

const { CONFIG_FILE, TINPIG_DIR } = require("./constants");

const DEFAULT_CONFIG = {
  templatesDir: `${TINPIG_DIR}/templates`,
};

class Configurator {
  configure() {
    return fs.ensureDir(TINPIG_DIR)
      .then(() => this.getConfig());
  }

  getConfig() {
    if (fs.pathExistsSync(CONFIG_FILE)) {
      return this.readConfig();
    }
    return this.createConfig();
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
