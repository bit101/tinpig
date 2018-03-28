const Configurator = require("./configurator");
const TemplateManager = require("./template_manager");
const ProjectMaker = require("./project_maker");
const { validatePathOrExit } = require("./file_utils");

const configurator = new Configurator();
const templateManager = new TemplateManager();

class Tinpig {
  start(templateName, filePath, customTemplatesDir) {
    const projectMaker = new ProjectMaker();
    configurator.configure(customTemplatesDir)
      .then(config      => this.setConfig(config))
      .then(()          => validatePathOrExit(filePath))
      .then(()          => templateManager.getTemplate(templateName, this.config))
      .then(template    => projectMaker.makeProject(filePath, template, this.config))
      .catch(err        => console.log(err));
  }

  setConfig(config) {
    this.config = config;
    return Promise.resolve();
  }

  displayList(customTemplatesDir) {
    configurator.configure(customTemplatesDir)
      .then(config => this.setConfig(config))
      .then(() => templateManager.displayAvailableTemplates(this.config))
      .catch(() => console.log("\nTinpig encountered an error and is unable to display templates."));
  }
}

module.exports = Tinpig;
