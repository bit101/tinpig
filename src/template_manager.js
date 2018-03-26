const fs = require("fs-extra");
const getTemplateChoice = require("./get_template_choice");

const { TEMPLATES_DIR, SAMPLE_PROJECTS } = require("./constants");

class TemplateManager  {
  //--------------------------------------
  // Get template by arg or ui choice
  //--------------------------------------
  getTemplate(templateName) {
    return fs.readdir(TEMPLATES_DIR)
      .then(templateNames => this.createTemplates(templateNames))
      .then(()            => this.readTemplates())
      .then(templates     => this.loadTemplates(templates))
      .then(()            => this.getTemplateFromArgsOrChoice(templateName));
  }

  createTemplates(templates) {
    if (templates.length === 0) {
      return fs.copy(SAMPLE_PROJECTS, TEMPLATES_DIR);
    }
    return null;
  }

  readTemplates() {
    return fs.readdir(TEMPLATES_DIR);
  }

  loadTemplates(templateNames) {
    this.templates = [];
    return Promise.all(templateNames.map((templateName, index) =>
      this.loadTemplate(templateName, index)));
  }

  loadTemplate(templateName, index) {
    const path = `${TEMPLATES_DIR}/${templateName}`;
    return fs.readJSON(`${path}/tinpig.json`)
      .then((template) => {
        template.path = path;
        this.templates[index] = template;
      });
  }

  getTemplateFromArgsOrChoice(templateName) {
    if (templateName && typeof templateName === "string") {
      return this.getTemplateFromArgs(templateName);
    }
    return getTemplateChoice(this.templates);
  }

  getTemplateFromArgs(templateName) {
    for (let i = 0; i < this.templates.length; i++) {
      if (templateName === this.templates[i].name) {
        return this.templates[i];
      }
    }
    console.log(`\nSorry, '${templateName}' is not a valid template`);
    console.log("Try one of these:");
    return getTemplateChoice(this.templates);
  }

  //--------------------------------------
  // List templates only (tinpig --list)
  //--------------------------------------
  displayAvailableTemplates() {
    return this.readTemplates()
      .then(templateNames => this.createTemplates(templateNames))
      .then(() => this.readTemplates())
      .then(templates => this.loadTemplates(templates))
      .then(() => this.printTemplateList());
  }

  printTemplateList() {
    console.log("\nAvailable templates:\n");
    for (let i = 0; i < this.templates.length; i++) {
      const template = this.templates[i];
      console.log(`${i + 1}. ${template.name}: ${template.description}`);
    }
    console.log("");
  }
}

module.exports = TemplateManager;

