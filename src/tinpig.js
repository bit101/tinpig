const Configurator = require("./configurator");
const TemplateManager = require("./template_manager");
const ProjectMaker = require("./project_maker");
const { printBanner, displayHelp } = require("./display_util");

class Tinpig {
  start() {
    const configurator = new Configurator();
    configurator.configure()
      .then(config => this.config = config)
      .then(() => printBanner(this.config.banner))
      .then(() => this.getArgs())
      .then(() => {
        if(this.args.wantsHelp) {
          return displayHelp();
        } else if(this.args.wantsList) {
          return this.displayList();
        } else {
          return this.getTemplate(this.args.template);
        }
      })
      .catch(err => console.log("\nTinpig encountered and error. Make sure the template is valid and the path you specified is available."));
  }

  getArgs() {
    this.args = {};
    for(let i = 0; i < process.argv.length; i++) {
      const arg = process.argv[i];
      if(arg === "--list") {
        this.args.wantsList = true;
      }
      if(arg === "--help") {
        this.args.wantsHelp = true;
      }
      if(arg.match(/^--path=/)) {
        this.args.path = arg.split("=")[1];
      }
      if(arg.match(/^--template=/)) {
        this.args.template = arg.split("=")[1];
      }
    }
  }

  displayList() {
    const templateManager = new TemplateManager();
    templateManager.displayAvailableTemplates();
  }

  getTemplate(path, templateName) {
    const templateManager = new TemplateManager();
    templateManager.getTemplate(path, templateName)
      .then(template => this.makeProject(template));
  }

  makeProject(template) {
    const projectMaker = new ProjectMaker();
    projectMaker.makeProject(this.args.path, template)
      .then(projectPath => {
        console.log(`\nComplete!. Project has been created in \`${projectPath}\`.\n`);
      });
  }
}

module.exports = Tinpig;
