const Configurator = require("./configurator");
const TemplateManager = require("./template_manager");
const ProjectMaker = require("./project_maker");
const { validatePathOrExit } = require("./file_utils");

const configurator = new Configurator();
const templateManager = new TemplateManager();

class Tinpig {
  async start(templateName, filePath, customTemplatesDir) {
    try {
      const projectMaker = new ProjectMaker();
      const config = await configurator.configure(customTemplatesDir);
      await validatePathOrExit(filePath);
      const template = await templateManager.getTemplate(templateName, config);
      await projectMaker.makeProject(filePath, template, config);
    } catch (err) {
      console.log("\nTinpig encountered an error and is unable to create a project.");
    }
  }

  async displayList(customTemplatesDir) {
    try {
      const config = await configurator.configure(customTemplatesDir);
      templateManager.displayAvailableTemplates(config);
    } catch (err) {
      console.log("\nTinpig encountered an error and is unable to display templates.");
    }
  }
}

module.exports = Tinpig;
