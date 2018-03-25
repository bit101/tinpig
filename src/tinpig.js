const fs = require("fs-extra");
const path = require("path");
const Configurator = require("./configurator");
const TemplateManager = require("./template_manager");
const ProjectMaker = require("./project_maker");
const resolveHome = require("./resolve_home");
const printBanner = require("./print_banner");

class Tinpig {
  start(templateName, filePath) {
    const configurator = new Configurator();
    const templateManager = new TemplateManager();
    const projectMaker = new ProjectMaker();


    configurator.configure()
      .then(config      => this.setConfig(config))
      .then(()          => printBanner(this.config.banner))
      .then(()          => this.validatePath(filePath))
      .then(()          => templateManager.getTemplate(templateName))
      .then(template    => projectMaker.makeProject(filePath, template))
      .catch(err        => console.log(err));
  }

  validatePath(filePath) {
    if (fs.pathExistsSync(resolveHome(filePath))) {
      console.log(`\nSorry, something already exists at '${filePath}'. Try a different path.`);
      process.exit();
    }

    const parentDir = path.dirname(resolveHome(filePath));
    try {
      fs.accessSync(parentDir, fs.constants.W_OK);
    } catch (err) {
      console.log(`\nSorry, you don't have access to create a project at '${filePath}'. Try a different path.`);
      process.exit();
    }
    return Promise.resolve();
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
