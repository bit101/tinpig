const Configurator = require("./configurator");
const TemplateManager = require("./template_manager");
const ProjectMaker = require("./project_maker");

class Tinpig {
  start() {
    const configurator = new Configurator();
    configurator.configure()
      .then(config => this.config = config)
      .then(() => this.printBanner())
      .then(() => this.getTemplate())
      .catch(err => console.log(err));
  }

  printBanner() {

    if(this.config.banner) {
      console.log("  _   _             _       ");
      console.log(" | | (_)           (_)      ");
      console.log(" | |_ _ _ __  _ __  _  __ _ ");
      console.log(" | __| | '_ \\| '_ \\| |/ _` |");
      console.log(" | |_| | | | | |_) | | (_| |");
      console.log("  \\__|_|_| |_| .__/|_|\\__, |");
      console.log("             | |       __/ |");
      console.log("             |_|      |___/ ");
    }
  }

  getTemplate() {
    const templateManager = new TemplateManager();
    templateManager.getTemplate()
      .then(template => this.makeProject(template));
  }

  makeProject(template) {
    const projectMaker = new ProjectMaker();
    projectMaker.makeProject(template)
      .then(projectPath => {
        console.log(`\nComplete!. Project has been created in \`${projectPath}\`.\n`);
      });
  }
}

module.exports = Tinpig;
