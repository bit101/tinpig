const fs = require("fs-extra");
const path = require("path");
const replace = require("replace");
const readline = require("readline");
const { TEMPLATES_DIR } = require("./constants");

class ProjectMaker {
  makeProject(path, template) {
    this.template = template;
    return this.getProjectPath(path)
      .then(() => this.getTokens())
      .then(() => this.copyTemplate())
      .then(() => this.replaceTokensInFiles())
      .then(() => this.renameFilesWithTokens(this.projectPath))
      .then(() => this.projectPath);
  }

  getProjectPath(path) {
    return new Promise((resolve, reject) => {
      if(path) {
        this.projectPath = this.resolveHome(path);
        resolve();
      } else {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
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
    return this.template.tokens.reduce((promise, token) => {
      return promise
        .then(() => this.getTokenValueFor(token));
    }, Promise.resolve());
  }

  getTokenValueFor(token) {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      console.log("\nEnter values for each token in this template:");
      rl.question(`Value for {${token}}: `, (value) => {
        rl.close();
        this.tokens[token] = value;
        resolve();
      });
    });
  }

  replaceTokensInFiles() {
    for(let token in this.tokens) {
      replace({
        regex: "\\${" + token + "}",
        replacement: this.tokens[token],
        paths: [this.projectPath],
        recursive: true,
        silent: true,
      });
    }
  }

  renameFilesWithTokens(path) {
    const files = fs.readdirSync(path)
    for(let i = 0; i < files.length; i++) {
      const file = files[i];
      const fullPath = `${path}/${file}`;
      if(this.isDir(fullPath)) {
        this.renameFilesWithTokens(fullPath);
      }
      for(let token in this.tokens) {
        const re = new RegExp("%" + token + "%");
        if(file.match(re)) {
          fs.moveSync(fullPath, `${path}/${file.replace(re, this.tokens[token])}`);
        }
      }
    }
  }

  isDir(path) {
    return fs.statSync(path).isDirectory();
  }

  resolveHome(filepath) {
    if (filepath[0] === '~') {
      return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
  }

  copyTemplate() {
    const filter = (file) => {
      if(this.template.ignore) {
        for(var i = 0; i < this.template.ignore.length; i++) {
          if(file.match(new RegExp(this.template.ignore[i]))) {
            return false;
          }
        }
      }
      return !file.match(/tinpig\.json$/);
    };
    const options = {
      overwrite: false,
      errorOnExist: true,
      filter: filter,
    };
    return fs.copy(this.template.path, this.projectPath, options)
      .then(() => this.projectPath);
  }
}

module.exports = ProjectMaker;
