const fs = require("fs-extra");
const path = require("path");
const replace = require("replace-in-file");
const readline = require("readline");

class ProjectMaker {
  makeProject(chosenPath, template) {
    this.template = template;
    return this.getProjectPath(chosenPath)
      .then(() => this.getTokens())
      .then(() => this.copyTemplate())
      .then(() => this.replaceTokensInFiles())
      .then(() => this.renameFilesWithTokens(this.projectPath))
      .then(() => this.displaySuccess())
      .catch(() => console.log(`\nUnable to create project at '${this.projectPath}'`));
  }

  getProjectPath(chosenPath) {
    return new Promise((resolve) => {
      if (chosenPath) {
        this.projectPath = this.resolveHome(chosenPath);
        resolve();
      } else {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        rl.question("Project directory: ", (projectPath) => {
          rl.close();
          this.projectPath = this.resolveHome(projectPath);
          resolve();
        });
      }
    });
  }

  getTokens() {
    this.tokens = {};
    if (!this.template.tokens) {
      return;
    }
    console.log("\nSupply values for each token in this template.");
    if (this.hasDefaults()) {
      console.log("Default values are in parentheses. Press enter to accept default.");
      console.log("Be careful with tokens marked with a *. Spaces or special characters in these may break project functionality.");
    }
    console.log("");
    // this is a way of chaining an arbitrary number of promises so that they all get fulfilled.
    // https://gist.github.com/anvk/5602ec398e4fdc521e2bf9940fd90f84
    const p = (promise, token) => promise.then(() => this.getTokenValuefor(token));
    return this.template.tokens.reduce(p, Promise.resolve());
  }

  hasDefaults() {
    for (let i = 0; i < this.template.tokens.length; i++) {
      if (this.template.tokens[i].default) {
        return true;
      }
    }
    return false;
  }

  getTokenValuefor(token) {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const defaultValue = token.default ? ` (${token.default})` : "";
      rl.question(`${token.isPath ? "* " : ""}${token.name}${defaultValue}: `, (value) => {
        rl.close();
        this.tokens[token.name] = value || token.default;
        resolve();
      });
    });
  }

  replaceTokensInFiles() {
    const fileSet = `${this.projectPath}/**`;
    Object.keys(this.tokens).forEach((token) => {
      const re = new RegExp("\\${" + token + "}", "g"); // eslint-disable-line
      const result = replace.sync({
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

  resolveHome(filepath) {
    if (filepath[0] === '~') {
      return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
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
