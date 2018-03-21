const Configurator = require("./configurator");
const TemplateManager = require("./template_manager");
const ProjectMaker = require("./project_maker");
const printBanner = require("./print_banner");

class Tinpig {
  start(templateName, path) {
    const configurator = new Configurator();
    const templateManager = new TemplateManager();
    const projectMaker = new ProjectMaker();

    configurator.configure()
      .then(config      => this.config = config)
      .then(()          => printBanner(this.config.banner))
      .then(()          => templateManager.getTemplate(templateName))
      .then(template    => projectMaker.makeProject(path, template))
      .then(projectPath => this.displaySuccess(projectPath))
      .catch(err        => console.log(err));
  }

  displaySuccess(projectPath) {
    if(projectPath) {
      console.log(`\nComplete!. Project has been created in \`${projectPath}\`.\n`);
    }
  }


  displayList() {
    const configurator = new Configurator();
    const templateManager = new TemplateManager();

    configurator.configure()
      .then(config => this.config = config)
      .then(() => printBanner(this.config.banner))
      .then(() => templateManager.displayAvailableTemplates())
      .catch(err => console.log("\nTinpig encountered an error and is unable to display templates."));
  }
}

module.exports = Tinpig;
