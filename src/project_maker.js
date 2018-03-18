const fs = require("fs-extra");
const path = require('path');
const readline = require("readline");
const { TEMPLATES_DIR } = require("./constants");

class ProjectMaker {
  makeProject(path, template) {
    return this.getProjectPath(path)
      .then(projectPath => this.copyTemplate(template, projectPath));
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
