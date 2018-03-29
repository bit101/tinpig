const fs = require("fs-extra");

const { CONFIG_FILE, TINPIG_DIR } = require("./constants");

const DEFAULT_CONFIG = {
  templatesDir: `${TINPIG_DIR}/templates`,
  userName: "User Name",
  userEmail: "username@sampledomain.com",
};

class Configurator {
  async configure(customTemplatesDir) {
    try {
      await fs.ensureDir(TINPIG_DIR);

      if (fs.pathExistsSync(CONFIG_FILE)) {
        return this.readConfig(customTemplatesDir);
      }
      return this.createConfig(customTemplatesDir);
    } catch (err) {
      console.log(err);
    }
  }

  async readConfig(customTemplatesDir) {
    try {
      const config = await fs.readJSON(CONFIG_FILE);
      return this.updateConfig(config, customTemplatesDir);
    } catch (err) {
      console.log(err);
    }
  }

  async updateConfig(config, customTemplatesDir) {
    try {
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
        await fs.writeJSON(CONFIG_FILE, config, { spaces: 2 });
      }

      if (customTemplatesDir) {
        config.templatesDir = customTemplatesDir;
      }
      return config;
    } catch (err) {
      console.log(err);
    }
  }

  async createConfig(customTemplatesDir) {
    try {
      await fs.writeJSON(CONFIG_FILE, DEFAULT_CONFIG, { spaces: 2 });
      return this.readConfig(customTemplatesDir);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Configurator;
