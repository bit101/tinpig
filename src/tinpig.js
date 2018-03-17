const setup = require("./setup");
const TemplateManager = require("./template_manager");
const ProjectMaker = require("./project_maker");

class Tinpig {
  start() {
    setup((config) => {
      this.config = config;
      this.getTemplate();
    });
  }

  getTemplate() {
    const templateManager = new TemplateManager();
    templateManager.getTemplate((template) => {
      this.template = template;
      this.makeProject();
    });
  }

  makeProject() {
    const projectMaker = new ProjectMaker();
    projectMaker.makeProject(this.template);
  }
}

module.exports = Tinpig;
