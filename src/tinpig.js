const Configurator = require("./configurator");
const TemplateManager = require("./template_manager");
const ProjectMaker = require("./project_maker");
const { validatePathOrExit } = require("./file_utils");

const configurator = new Configurator();
const templateManager = new TemplateManager();

class Tinpig {
  start(templateName, filePath, customTemplatesDir) {
    this.customTemplatesDir = customTemplatesDir;
    const projectMaker = new ProjectMaker();
    configurator.configure()
      .then(config      => this.setConfig(config))
      .then(()          => validatePathOrExit(filePath))
      .then(()          => templateManager.getTemplate(templateName, this.getTemplatesDir()))
      .then(template    => projectMaker.makeProject(filePath, template))
      .catch(err        => console.log(err));
  }

  setConfig(config) {
    this.config = config;
    return Promise.resolve();
  }

  getTemplatesDir() {
    return this.customTemplatesDir || this.config.templatesDir;
  }

  displayList(customTemplatesDir) {
    this.customTemplatesDir = customTemplatesDir;
    configurator.configure()
      .then(config => this.setConfig(config))
      .then(() => templateManager.displayAvailableTemplates(this.getTemplatesDir()))
      .catch(() => console.log("\nTinpig encountered an error and is unable to display templates."));
  }
}

module.exports = Tinpig;
