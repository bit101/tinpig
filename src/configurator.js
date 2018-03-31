const fs = require("fs-extra");
const inquirer = require("inquirer");

const { CONFIG_FILE, TINPIG_DIR } = require("./constants");
const { resolveHome } = require("./file_utils");

const DEFAULT_CONFIG = {
  templatesDir: `${TINPIG_DIR}/templates`,
  userName: "User Name",
  userEmail: "username@sampledomain.com",
  invalidPathChars: "‘“!#$%&+^<=>` ",
};

class Configurator {
  async configure(customTemplatesDir) {
    try {
      await fs.ensureDir(TINPIG_DIR);

      const exists = await fs.pathExists(CONFIG_FILE);
      if (exists) {
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
      if (typeof config.invalidPathChars !== "string") {
        config.invalidPathChars = DEFAULT_CONFIG.invalidPathChars;
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

  async reconfigure() {
    const config = await this.configure();

    const prompt = [{
      type: "input",
      name: "userName",
      message: "User name",
      default: config.userName,
      prefix: "",
      suffix: ":",
    },
    {
      type: "input",
      name: "userEmail",
      message: "User email",
      default: config.userEmail,
      prefix: "",
      suffix: ":",
    },
    {
      type: "input",
      name: "templatesDir",
      message: "Custom templates directory",
      default: config.templatesDir,
      prefix: "",
      suffix: ":",
    },
    {
      type: "input",
      name: "invalidPathChars",
      message: "Invalid path characters",
      default: config.invalidPathChars,
      prefix: "",
      suffix: ":",
    }];
    const answers = await inquirer.prompt(prompt);
    config.userName = answers.userName;
    config.userEmail = answers.userEmail;
    config.templatesDir = resolveHome(answers.templatesDir);
    config.invalidPathChars = answers.invalidPathChars;
    fs.writeJSON(CONFIG_FILE, config, { spaces: 2 });
  }

  async reset() {
    const answers = await inquirer.prompt([{
      type: "confirm",
      name: "okToReset",
      message: "This will reset your tinpig config to default. Are you sure?",
      prefix: "",
      suffix: ":",
    }]);
    if (answers.okToReset) {
      fs.writeJSON(CONFIG_FILE, DEFAULT_CONFIG, { spaces: 2 });
    }
  }
}

module.exports = Configurator;
