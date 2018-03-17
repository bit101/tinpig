const fs = require("fs-extra");
const path = require('path');
const readline = require("readline");
const { TEMPLATES_DIR } = require("./constants");

class ProjectMaker {
  makeProject(template) {
    this.template = template;
    this.getProjectPath();
  }

  getProjectPath() {
    this.projectPath = process.argv[2];
    if(!this.projectPath) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question("Project directory: ", (answer) => {
        rl.close();
        this.projectPath = answer;
        this.copyTemplate();
      });
    }
    else {
      this.copyTemplate();
    }
  }

  resolveHome(filepath) {
    if (filepath[0] === '~') {
      return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
  }

  copyTemplate() {
    this.projectPath = this.resolveHome(this.projectPath);
    fs.copy(this.template.path, this.projectPath)
      .then(() => {
        console.log("DONE!");
        console.log(`Project is at ${this.projectPath}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = ProjectMaker;
