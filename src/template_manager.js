const fs = require("fs-extra");
const getTemplateChoice = require("./get_template_choice");

const { SAMPLE_PROJECTS } = require("./constants");

class TemplateManager  {
  //--------------------------------------
  // Get template by arg or ui choice
  //--------------------------------------
  async getTemplate(templateName, config) {
    this.config = config;
    await this.prepTemplates(config.templatesDir);

    if (templateName && typeof templateName === "string") {
      return this.getTemplateFromArgs(templateName);
    }
    return getTemplateChoice(this.templates);
  }

  async getTemplateFromArgs(templateName) {
    for (let i = 0; i < this.templates.length; i++) {
      if (templateName === this.templates[i].name) {
        return this.templates[i];
      }
    }
    console.log(`\nSorry, '${templateName}' is not a valid template`);
    console.log("Try one of these:");
    return this.getTemplateChoice(this.templates);
  }

  //--------------------------------------
  // List templates only (tinpig --list)
  //--------------------------------------
  async displayAvailableTemplates(config) {
    this.config = config;
    await this.prepTemplates(config.templatesDir);
    this.printTemplateList();
  }

  printTemplateList() {
    console.log("\nAvailable templates:\n");
    for (let i = 0; i < this.templates.length; i++) {
      const template = this.templates[i];
      console.log(`${i + 1}. ${template.name}: ${template.description}`);
    }
    console.log("");
  }

  //--------------------------------------
  // Common
  //--------------------------------------
  async prepTemplates(templatesDir) {
    this.templatesDir = templatesDir;
    await fs.ensureDir(this.templatesDir);
    const templatePaths = await fs.readdir(this.templatesDir);
    await this.createTemplates(templatePaths);
    const templates = await this.readTemplates();
    await this.loadTemplates(templates);
    this.verifyTemplates();
  }

  async createTemplates(templatePaths) {
    if (templatePaths.length === 0) {
      await fs.copy(SAMPLE_PROJECTS, this.templatesDir);
    }
  }

  async readTemplates() {
    return fs.readdir(this.templatesDir);
  }

  async loadTemplates(templatePaths) {
    this.templates = [];
    return Promise.all(templatePaths.map(templateName => this.loadTemplate(templateName)));
  }

  async loadTemplate(templateName) {
    const path = `${this.templatesDir}/${templateName}`;
    const manifestPath = `${this.templatesDir}/${templateName}/tinpig.json`;
    const exists = await fs.pathExists(manifestPath);
    if (!exists) {
      // If there is no manifest file, skip it.
      // Path could be a .DS_Store or something.
      return;
    }
    const template = await fs.readJSON(manifestPath);
    template.path = path;
    this.templates.push(template);
  }

  verifyTemplates() {
    const names = [];
    const conflictedTemplates = [];
    for (let i = 0; i < this.templates.length; i++) {
      const { name } = this.templates[i];
      if (names.indexOf(name) !== -1) {
        conflictedTemplates.push(name);
      }
      names.push(name);
    }
    if (conflictedTemplates.length > 0) {
      console.log("\nDuplicate template names found in templates directory:");
      for (let i = 0; i < conflictedTemplates.length; i++) {
        console.log(`  ${conflictedTemplates[i]}`);
      }
      console.log("This could make it difficult to select the correct template.");
    }
  }
}

module.exports = TemplateManager;

