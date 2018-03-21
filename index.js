#! /usr/bin/env node
const commander = require("commander");

const Tinpig = require("./src/tinpig");

commander.on("--help", () => {
  console.log("\n  Call `tinpig` with no options for fully interactive ui.");
  console.log("\n  Project home: https://github.com/bit101/tinpig\n");
});

commander
  .version(require('./package.json').version, "-v, --version")
  .option("-l, --list", "list all available templates")
  .option("-t, --template [template]", "specify which template to use")
  .option("-p, --path [path]", "specify path for project")
  .parse(process.argv);

const tinpig = new Tinpig();

if (commander.list) {
  tinpig.displayList();
} else {
  tinpig.start(commander.template, commander.path);
}
