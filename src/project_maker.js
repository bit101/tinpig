const fs = require("fs-extra");
const path = require("path");
const replace = require("replace");
const readline = require("readline");
const { TEMPLATES_DIR } = require("./constants");

class ProjectMaker {
  makeProject(path, template) {
    return this.getProjectPath(path)
      .then(projectPath => {
        this.projectPath = projectPath;
        return this.getTokens(template);
      })
      .then(() => this.copyTemplate(template, this.projectPath))
      .then(() => this.replaceTokensInFiles(path))
      .then(() => this.renameFilesWithTokens(path))
      .then(() => path);
  }

  getProjectPath(path) {
    return new Promise((resolve, reject) => {
      if(path) {
        resolve(path);
      } else {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        rl.question("Project directory: ", (projectPath) => {
          rl.close();
          resolve(this.resolveHome(projectPath));
        });
      }
    });
  }

  getTokens(template) {
    this.tokens = {};
    return template.tokens.reduce((promise, token) => {
      return promise
        .then(() => {
          return this.getTokenValueFor(token);
        })
    }, Promise.resolve());
  }

  getTokenValueFor(token) {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question(`Value for {${token}}: `, (value) => {
        rl.close();
        this.tokens[token] = value;
        resolve();
      });
    });
  }

  replaceTokensInFiles(path) {
    for(let token in this.tokens) {
      replace({
        regex: "\\${" + token + "}",
        replacement: this.tokens[token],
        paths: [path],
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

  copyTemplate(template, projectPath) {
    const filter = (file) => {
      if(template.ignore) {
        for(var i = 0; i < template.ignore.length; i++) {
          if(file.match(new RegExp(template.ignore[i]))) {
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
    return fs.copy(template.path, projectPath, options)
      .then(() => projectPath);
  }
}

module.exports = ProjectMaker;
