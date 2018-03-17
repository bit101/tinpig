const fs = require("fs-extra");
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

  copyTemplate() {
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
