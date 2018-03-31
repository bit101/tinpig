#! /usr/bin/env node
const commander = require("commander");
const Tinpig = require("./src/tinpig");
const { greaterOrEqualVersion } = require("./src/compare_versions");

const requiredVersion = "v8.5.0";
if (!greaterOrEqualVersion(process.version, requiredVersion)) {
  console.log(`You are running nodejs ${process.version}.`);
  console.log(`tinpig requires nodejs ${requiredVersion} or higher.`);
  console.log("Please upgrade.");
  process.exit();
}
commander.on("--help", () => {
  console.log("\n  Call `tinpig` with no options for fully interactive ui.");
  console.log("\n  Project home: https://github.com/bit101/tinpig\n");
});

commander
  .option("-t, --template [template]", "specify which template to use")
  .option("-p, --path [path]", "specify path for project")
  .option("-d, --directory [directory]", "path to a folder of custom templates")
  .option("-l, --list", "list all available templates")
  .option("-c, --configure", "configure tinpig options")
  .option("-r, --reset", "reset tinpig options")
  .version(require('./package.json').version, "-v, --version")
  .parse(process.argv);

const tinpig = new Tinpig();

if (commander.list) {
  tinpig.displayList(commander.directory);
} else if (commander.configure) {
  tinpig.configure();
} else if (commander.reset) {
  tinpig.reset();
} else {
  tinpig.start(commander.template, commander.path, commander.directory);
}
