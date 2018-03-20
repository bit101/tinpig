const fs = require("fs-extra");
const readline = require("readline");

const { TEMPLATES_DIR, SAMPLE_PROJECTS } = require("./constants");

class TemplateManager  {
  getTemplate(templateName) {
    return fs.readdir(TEMPLATES_DIR)                              // are there any templates?
      .then(templateNames => this.createTemplates(templateNames)) // if not, create sample ones
      .then(() => this.readTemplates())                           // read the template list
      .then(templates => this.loadTemplates(templates))           // load each template
      .then(() => {
        if(templateName) {                                        // did user specify a template?
          return this.getTemplateFromArgs(templateName);          // get that template 
        }
        else {
          return this.getTemplateChoice();                        // no. ask for the template
        }
      });
  }

  getTemplateFromArgs(templateName) {
    for(var i = 0; i < this.templates.length; i++) {
      if(templateName === this.templates[i].name) {
        return this.templates[i];
      }
    }
  }

  getTemplateChoice() {
    return this.getChoice()                         // get user's choice
      .then(choice => this.templates[choice]);      // return template
  }

  displayAvailableTemplates() {
    return this.readTemplates()
      .then(templateNames => this.createTemplates(templateNames))
      .then(() => this.readTemplates())
      .then(templates => this.loadTemplates(templates))
      .then(() => this.printTemplateList());
  }

  printTemplateList() {
    console.log("\nAvailable templates:\n");
    for(let i = 0; i < this.templates.length; i++) {
      const template = this.templates[i];
      const command = template.name.indexOf(" ") === -1 ? template.name : `"${template.name}"`;
      console.log(template.name);
      console.log(this.getUnderscore(template.name.length));
      console.log("  " + template.description);
      console.log(`  > tinpig --template=${command} --path=my_project`);
      console.log("");
    }
  }

  getUnderscore(length) {
    let underscore = "";
    for(let i = 0; i < length; i++) {
      underscore += "-";
    }
    return underscore;
  }

  readTemplates() {
    return fs.readdir(TEMPLATES_DIR);
  }

  createTemplates(templates) {
    if(templates.length === 0) {
      return fs.copy(SAMPLE_PROJECTS, TEMPLATES_DIR);
    }
    return null;
  }

  loadTemplates(templateNames) {
    this.templates = [];
    return Promise.all(templateNames.map((templateName, index) => {
      return this.loadTemplate(templateName, index);
    }));
  }

  loadTemplate(templateName, index) {
    const path = `${TEMPLATES_DIR}/${templateName}`;
    return fs.readJSON(`${path}/tinpig.json`)
      .then(template => {
        template.path = path;
        this.templates[index] = template;
      });
  }

  getChoice() {
    return new Promise((resolve, reject) => {
      console.log("\nAvailable templates:\n");
      for(let i = 0; i < this.templates.length; i++) {
        console.log(`${i + 1}. ${this.templates[i].name}`);
      }

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question("\nChoice (q = quit): ", (answer) => {
        rl.close();
        if(answer.toLowerCase() === "q") {
          return;
        }
        if(answer < "1" || answer > this.templates.length.toString()) {
          console.log(`${answer} is not a valid choice. Choose a number from 1 to ${this.templates.length}.`);
        } else {
          resolve(answer - 1);
        }
      });
    });
  }
};

module.exports = TemplateManager;

