const fs = require("fs-extra");
const readline = require("readline");

const {
  TEMPLATES_DIR,
  SAMPLE_PROJECTS,
} = require("./constants");

class TemplateManager  {
  getTemplate() {
    return fs.readdir(TEMPLATES_DIR)                              // are there any templates?
      .then(templateNames => this.createTemplates(templateNames)) // if not, create sample ones
      .then(() => this.readTemplates())                           // read tht template list
      .then(templates => this.loadTemplates(templates))           // load each template
      .then(() => this.listTemplates())                           // display the list
      .then(() => this.getChoice())                               // get user's choice
      .then(choice => this.templates[choice]);                    // return template
  }

  displayAvailableTemplates() {
    return this.readTemplates()
      .then(templateNames => this.createTemplates(templateNames))
      .then(() => this.readTemplates())
      .then(templates => this.loadTemplates(templates))
      .then(() => this.printTemplateList())
      .catch(err => console.log("Unable to read templates."));
  }

  printTemplateList() {
    console.log("\nAvailable templates:\n");
    for(let i = 0; i < this.templates.length; i++) {
      const name = this.templates[i].name;
      let underscore = "";
      for(let i = 0; i < name.length; i++) {
        underscore += "=";
      }
      const desc = this.templates[i].description;
      console.log(name);
      console.log(underscore);
      console.log(desc);
      console.log("");
    }
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

  listTemplates() {
    console.log("\nAvailable templates:\n");
    for(let i = 0; i < this.templates.length; i++) {
      console.log(`${i + 1}. ${this.templates[i].name}`);
    }
  }

  getChoice() {
    return new Promise((resolve, reject) => {
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

