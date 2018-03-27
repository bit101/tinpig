const fs = require("fs-extra");
const getTemplateChoice = require("./get_template_choice");

const { SAMPLE_PROJECTS } = require("./constants");

class TemplateManager  {
  setTemplatesDir(templatesDir) {
    this.templatesDir = templatesDir;
  }

  //--------------------------------------
  // Get template by arg or ui choice
  //--------------------------------------
  getTemplate(templateName) {
    return fs.ensureDir(this.templatesDir)
      .then(()            => fs.readdir(this.templatesDir))
      .then(templateNames => this.createTemplates(templateNames))
      .then(()            => this.readTemplates())
      .then(templates     => this.loadTemplates(templates))
      .then(()            => this.getTemplateFromArgsOrChoice(templateName));
  }

  createTemplates(templates) {
    if (templates.length === 0) {
      return fs.copy(SAMPLE_PROJECTS, this.templatesDir);
    }
    return null;
  }

  readTemplates() {
    return fs.readdir(this.templatesDir);
  }

  loadTemplates(templateNames) {
    this.templates = [];
    return Promise.all(templateNames.map(templateName => this.loadTemplate(templateName)));
  }

  loadTemplate(templateName) {
    const path = `${this.templatesDir}/${templateName}`;
    const manifestPath = `${this.templatesDir}/${templateName}/tinpig.json`;
    if (!fs.pathExistsSync(manifestPath)) {
      // If there is no manifest file, skip it. Path could be a .DS_Store or something.
      return Promise.resolve();
    }
    return fs.readJSON(manifestPath)
      .then((template) => {
        template.path = path;
        this.templates.push(template);
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
    // TODO. This flow may need some adjusting to make sure it works the same way as getTemplate.
    return fs.ensureDir(this.templatesDir)
      .then(() => this.readTemplates())
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

