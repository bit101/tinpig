const Configurator = require("./configurator");
const TemplateManager = require("./template_manager");
const ProjectMaker = require("./project_maker");
const { validatePathOrExit } = require("./file_utils");
const printBanner = require("./print_banner");

class Tinpig {
  start(templateName, filePath) {
    const configurator = new Configurator();
    const templateManager = new TemplateManager();
    const projectMaker = new ProjectMaker();


    configurator.configure()
      .then(config      => this.setConfig(config))
      .then(()          => printBanner(this.config.banner))
      .then(()          => validatePathOrExit(filePath))
      .then(()          => templateManager.getTemplate(templateName))
      .then(template    => projectMaker.makeProject(filePath, template))
      .catch(err        => console.log(err));
  }

  setConfig(config) {
    this.config = config;
  }

  displayList() {
    const configurator = new Configurator();
    const templateManager = new TemplateManager();

    configurator.configure()
      .then(config => this.setConfig(config))
      .then(() => printBanner(this.config.banner))
      .then(() => templateManager.displayAvailableTemplates())
      .catch(() => console.log("\nTinpig encountered an error and is unable to display templates."));
  }
}

module.exports = Tinpig;
