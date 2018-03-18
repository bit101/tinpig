const Configurator = require("./configurator");
const TemplateManager = require("./template_manager");
const ProjectMaker = require("./project_maker");

class Tinpig {
  start() {
    const configurator = new Configurator();
    configurator.configure()
      .then(config => this.config = config)
      .then(() => this.printBanner())
      .then(() => this.getArgs())
      .then(args => {
        if(args.wantsHelp) {
          return this.displayHelp();
        }
        else if(args.wantsList) {
          return this.displayList();
        } else {
          return this.getTemplate(args.path, args.template);
        }
      })
      .catch(err => console.log(err));
  }

  getArgs() {
    const args = {};
    for(let i = 0; i < process.argv.length; i++) {
      const arg = process.argv[i];
      if(arg === "--list") {
        args.wantsList = true;
      }
      if(arg === "--help") {
        args.wantsHelp = true;
      }
      if(arg.match(/^--path=/)) {
        args.path = arg.split("=")[1];
      }
      if(arg.match(/^--template=/)) {
        args.template = arg.split("=")[1];
      }
    }
    return args;
  }

  printBanner() {
    if(this.config.banner) {
      console.log("  _   _             _       ");
      console.log(" | | (_)           (_)      ");
      console.log(" | |_ _ _ __  _ __  _  __ _ ");
      console.log(" | __| | '_ \\| '_ \\| |/ _` |");
      console.log(" | |_| | | | | |_) | | (_| |");
      console.log("  \\__|_|_| |_| .__/|_|\\__, |");
      console.log("             | |       __/ |");
      console.log("             |_|      |___/ ");
    }
  }

  displayList() {
    const templateManager = new TemplateManager();
    templateManager.displayAvailableTemplates();
  }

  displayHelp() {
    console.log("Usage:");
    console.log("  tinpig [options]");
    console.log("\nOptions:");
    console.log("  --help - Display this help.");
    console.log("  --list - List all available templates.");
    console.log("  --path - Relative or absolute path to create new project");
    console.log("  --template - Template name to use. Get name from --list.");
    console.log("\nExamples:");
    console.log("\nFully Interactive:");
    console.log("  tinpig");
    console.log("\nWith path. Will be prompted for template:");
    console.log("  tinpig --path=MyProject");
    console.log("  tinpig --path=\"My Poorly Named Project With Spaces\"");
    console.log("  tinpig --path=My\\ Poorly\\ Named\\ Project\\ With\\ Spaces");
    console.log("  tinpig --path=/home/keith/projects/MyProject");
    console.log("  tinpig --path=~/projects/MyProject");
    console.log("\nWith template. Will be prompted for path:");
    console.log("  tinpig --template=\"HTML Project\"");
    console.log("  tinpig --template=HTML\\ Project");
    console.log("\nWith path and template:");
    console.log("  tinpig --path=MyProject --template=HTML\\ Project");
  }



  getTemplate(path, templateName) {
    const templateManager = new TemplateManager();
    templateManager.getTemplate(path, templateName)
      .then(template => this.makeProject(template));
  }

  makeProject(template) {
    const projectMaker = new ProjectMaker();
    projectMaker.makeProject(template)
      .then(projectPath => {
        console.log(`\nComplete!. Project has been created in \`${projectPath}\`.\n`);
      })
      .catch(err => console.log("\nUnable to create project. Make sure the template is valid and the path you specified is available."));
  }
}

module.exports = Tinpig;
