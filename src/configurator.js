const fs = require("fs-extra");

const { CONFIG_FILE, TINPIG_DIR } = require("./constants");

const DEFAULT_CONFIG = {
  templatesDir: `${TINPIG_DIR}/templates`,
  userName: "User Name",
  userEmail: "username@sampledomain.com",
};

class Configurator {
  configure(customTemplatesDir) {
    return fs.ensureDir(TINPIG_DIR)
      .then(() => this.getConfig(customTemplatesDir));
  }

  getConfig(customTemplatesDir) {
    if (fs.pathExistsSync(CONFIG_FILE)) {
      return this.readConfig(customTemplatesDir);
    }
    return this.createConfig(customTemplatesDir);
  }

  readConfig(customTemplatesDir) {
    return fs.readJSON(CONFIG_FILE)
      .then(config => this.updateConfig(config, customTemplatesDir));
  }

  updateConfig(config, customTemplatesDir) {
    let updated = false;
    if (!config.templatesDir) {
      config.templatesDir = DEFAULT_CONFIG.templatesDir;
      updated = true;
    }
    if (typeof config.userName !== "string") {
      config.userName = DEFAULT_CONFIG.userName;
      updated = true;
    }
    if (typeof config.userEmail !== "string") {
      config.userEmail = DEFAULT_CONFIG.userEmail;
      updated = true;
    }

    if (updated) {
      return fs.writeJSON(CONFIG_FILE, config, { spaces: 2 })
        .then(() => this.addCustomTemplatesDir(config, customTemplatesDir));
    }
    return this.addCustomTemplatesDir(config, customTemplatesDir);
  }

  addCustomTemplatesDir(config, customTemplatesDir) {
    if (customTemplatesDir) {
      config.templatesDir = customTemplatesDir;
    }
    return config;
  }

  createConfig(customTemplatesDir) {
    return fs.writeJSON(CONFIG_FILE, DEFAULT_CONFIG, { spaces: 2 })
      .then(() => this.readConfig(customTemplatesDir));
  }
}

module.exports = Configurator;
