const fs = require("fs-extra");
const replace = require("replace-in-file");
const inquirer = require("inquirer");
const { resolveHome, validatePath } = require("./file_utils");

class ProjectMaker {
  makeProject(chosenPath, template, config) {
    this.template = template;
    this.config = config;
    return this.getProjectPath(chosenPath)
      .then(() => this.getTokens())
      .then(() => this.copyTemplate())
      .then(() => this.replaceTokensInFiles())
      .then(() => this.renameFilesWithTokens(this.projectPath))
      .then(() => this.displaySuccess())
      .catch(() => console.log(`\nUnable to create project at '${this.projectPath}'`));
  }

  getProjectPath(chosenPath) {
    if (chosenPath) {
      this.projectPath = resolveHome(chosenPath);
      return Promise.resolve();
    }
    return inquirer.prompt([
      {
        type: "input",
        name: "projectPath",
        message: "Project path",
        prefix: "",
        suffix: ":",
        validate: validatePath,
      },
    ])
      .then((answer) => {
        this.projectPath = resolveHome(answer.projectPath);
      });
  }

  getTokens() {
    if (!this.template.tokens) {
      this.tokens = {};
      return;
    }

    const validator = (token) => { // eslint-disable-line
      return (value) => {
        if (token.isPath && value.indexOf(" ") !== -1) {
          return "This value should not contain spaces.";
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
    return inquirer.prompt(prompts)
      .then(answers => this.addSpecialTokens(answers));
  }

  addSpecialTokens(answers) {
    answers.TINPIG_USER_NAME = this.config.userName;
    answers.TINPIG_USER_EMAIL = this.config.userEmail;
    this.tokens = answers;
  }

  replaceTokensInFiles() {
    const fileSet = `${this.projectPath}/**`;
    Object.keys(this.tokens).forEach((token) => {
      const re = new RegExp("\\${" + token + "}", "g"); // eslint-disable-line
      replace.sync({
        files: fileSet,
        from: re,
        to: this.tokens[token],
      });
    });
  }

  renameFilesWithTokens(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fullPath = `${currentPath}/${file}`;
      if (this.isDir(fullPath)) {
        this.renameFilesWithTokens(fullPath);
      }
      Object.keys(this.tokens).forEach((token) => {
        const re = new RegExp(`%${token}%`);
        if (file.match(re)) {
          fs.moveSync(fullPath, `${currentPath}/${file.replace(re, this.tokens[token])}`);
        }
      });
    }
  }

  isDir(thePath) {
    return fs.statSync(thePath).isDirectory();
  }

  copyTemplate() {
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
    return fs.copy(this.template.path, this.projectPath, options)
      .then(() => this.projectPath);
  }

  displaySuccess() {
    console.log(`\nSuccess! Your project has been created at '${this.projectPath}'.\n`);
    if (this.template.postMessage) {
      console.log(this.template.postMessage);
    }
  }
}

module.exports = ProjectMaker;
