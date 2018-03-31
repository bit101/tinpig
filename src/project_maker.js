const fs = require("fs-extra");
const path = require("path");
const replace = require("replace-in-file");
const inquirer = require("inquirer");
const { resolveHome, validatePath } = require("./file_utils");

class ProjectMaker {
  async makeProject(chosenPath, template, config) {
    this.template = template;
    this.config = config;
    if (template.preMessage) {
      console.log("");
      console.log(template.preMessage);
    }

    const projectPath = await this.getProjectPath(chosenPath);
    const tokens = await this.getTokens(projectPath);
    try {
      await this.copyTemplate(projectPath);
      await this.replaceTokensInFiles(projectPath, tokens);
      await this.renameFilesWithTokens(projectPath, tokens);
      await this.displaySuccess(projectPath);
    } catch (err) {
      console.log(`\nUnable to create project at '${projectPath}'`);
    }
  }

  async getProjectPath(chosenPath) {
    if (chosenPath) {
      return resolveHome(chosenPath);
    }
    const prompt = [{
      type: "input",
      name: "projectPath",
      message: "Project path",
      prefix: "",
      suffix: ":",
      validate: validatePath,
    }];
    const answer = await inquirer.prompt(prompt);
    return resolveHome(answer.projectPath);
  }

  async getTokens(projectPath) {
    if (!this.template.tokens) {
      const tokens = {};
      this.addSpecialTokens(tokens, projectPath);
      return tokens;
    }

    const validator = (token) => { // eslint-disable-line
      const re = /[‘“!#$%&+^<=> `]/;
      return (value) => {
        if (token.isPath && re.test(value)) {
          return "This value should not contain spaces or special characters: ‘“!#$%&+^<=>`.";
        }
        if (token.required && value === "") {
          return "This value is required.";
        }
        return true;
      };
    };

    const prompts = this.template.tokens.map((token) => {
      const prompt = {
        type: "input",
        name: token.name,
        message: token.name,
        default: token.default,
        prefix: "",
        suffix: ":",
        validate: validator(token),
      };
      return prompt;
    });
    console.log("\nSupply values for each token in this template.");
    const tokens = await inquirer.prompt(prompts);
    this.addSpecialTokens(tokens, projectPath);
    return tokens;
  }

  addSpecialTokens(answers, projectPath) {
    const fullPath = path.resolve("./", resolveHome(projectPath));
    answers.TINPIG_USER_NAME = this.config.userName;
    answers.TINPIG_USER_EMAIL = this.config.userEmail;
    answers.TINPIG_PROJECT_PATH = fullPath;
    answers.TINPIG_PROJECT_DIR = path.basename(fullPath);
  }

  replaceTokensInFiles(projectPath, tokens) {
    const fileSet = `${projectPath}/**`;
    Object.keys(tokens).forEach((token) => {
      const re = new RegExp("\\${" + token + "}", "g"); // eslint-disable-line
      replace.sync({
        files: fileSet,
        from: re,
        to: tokens[token],
      });
    });
  }

  renameFilesWithTokens(currentPath, tokens) {
    const files = fs.readdirSync(currentPath);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fullPath = `${currentPath}/${file}`;
      if (this.isDir(fullPath)) {
        this.renameFilesWithTokens(fullPath, tokens);
      }
      Object.keys(tokens).forEach((token) => {
        const re = new RegExp(`%${token}%`);
        if (file.match(re)) {
          fs.moveSync(fullPath, `${currentPath}/${file.replace(re, tokens[token])}`);
        }
      });
    }
  }

  isDir(thePath) {
    return fs.statSync(thePath).isDirectory();
  }

  async copyTemplate(projectPath) {
    const filter = (file) => {
      if (this.template.ignore) {
        for (let i = 0; i < this.template.ignore.length; i++) {
          if (file.match(new RegExp(this.template.ignore[i]))) {
            return false;
          }
        }
      }
      return !file.match(/tinpig\.json$/);
    };
    const options = {
      overwrite: false,
      errorOnExist: true,
      filter,
    };

    await fs.copy(this.template.path, projectPath, options);
  }

  displaySuccess(projectPath) {
    console.log(`\nSuccess! Your project has been created at '${projectPath}'.\n`);
    if (this.template.postMessage) {
      console.log(this.template.postMessage);
    }
  }
}

module.exports = ProjectMaker;
