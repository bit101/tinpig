const fs = require("fs-extra");
const path = require('path');
const readline = require("readline");
const { TEMPLATES_DIR } = require("./constants");

class ProjectMaker {
  makeProject(template) {
    return this.getProjectPath()
      .then(projectPath => this.copyTemplate(template, projectPath));
  }

  getProjectPath() {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question("Project directory: ", (projectPath) => {
        rl.close();
        resolve(this.resolveHome(projectPath));
      });
    });
  }

  resolveHome(filepath) {
    if (filepath[0] === '~') {
      return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
  }

  copyTemplate(template, projectPath) {
    return fs.copy(template.path, projectPath)
      .then(() => projectPath);
  }
}

module.exports = ProjectMaker;
