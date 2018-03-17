const fs = require("fs-extra");
const readline = require("readline");

const {
  TEMPLATES_DIR,
  SAMPLE_PROJECTS,
} = require("./constants");

class TemplateManager  {
  getTemplate(callback) {
    this.callback = callback;
    this.checkTemplates();
  }

  checkTemplates() {
    fs.readdir(TEMPLATES_DIR)
      .then((templates) => {
        if (templates.length === 0) {
          this.createTemplates();
        } else {
          this.readTemplates();
        }
      })
      .catch((err) => {
        console.log(`Unable to verify templates at ${TEMPLATES_DIR}`);
        console.log(err);
      });
  }

  readTemplates() {
    fs.readdir(TEMPLATES_DIR)
      .then((templates) => {
        this.templateNames = templates;
        this.templates = [];
        this.loadTemplates();
      })
      .catch((err) => {
        console.log(`Unable to read templates at ${TEMPLATES_DIR}`);
        console.log(err);
      });
  }

  createTemplates() {
    fs.copy(SAMPLE_PROJECTS, TEMPLATES_DIR)
      .then(() => {
        this.readTemplates();
      })
      .catch((err) => {
        console.log(`Unable to create templates at ${TEMPLATES_DIR}`);
        console.log(err);
      });
  }

  loadTemplates() {
    this.index = 0;
    this.loadNextTemplate();
  }

  loadNextTemplate() {
    if(this.index >= this.templateNames.length) {
      this.listTemplates();
      this.getChoice();
    } else {
      const templateName = this.templateNames[this.index];
      this.loadTemplate(templateName);
    }
  }

  loadTemplate(templateName) {
    const path = `${TEMPLATES_DIR}/${templateName}`;
    fs.readJSON(`${path}/tinpig.json`)
      .then((template) => {
        template.path = path;
        this.templates.push(template);
        this.index++;
        this.loadNextTemplate();
      })
      .catch((err) => {
        console.log(`Unable to load template: ${templateName}`);
        console.log(err);
        this.index++;
        this.loadNextTemplate();
      });
  }

  listTemplates() {
    console.log("Available templates:");
    for(let i = 0; i < this.templates.length; i++) {
      console.log(`${i + 1}. ${this.templates[i].name}`);
    }
    console.log("Q. Quit");
  }

  getChoice() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("Choice: ", (answer) => {
      rl.close();
      if(answer.toLowerCase() === "q") {
        return;
      }
      if(answer < "1" || answer > this.templates.length.toString()) {
        this.listTemplates();
      } else {
        const template = this.templates[answer - 1]
        this.callback(template);
      }
    });
  }
};

module.exports = TemplateManager;

