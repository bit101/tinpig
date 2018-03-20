function printBanner(showBanner) {
  if(showBanner) {
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

function displayHelp() {
  console.log("Usage:");
  console.log("  tinpig [options]");
  console.log("\nOptions:");
  console.log("  --help                  Display this help.");
  console.log("  --list                  List all available templates.");
  console.log("  --path=<path>           Relative or absolute path to create new project");
  console.log("  --template=<template>   Template name to use. Get name from --list.");
  console.log("\nExamples:");
  console.log("\nFully interactive:");
  console.log("  tinpig");
  console.log("\nWith path (will be prompted for template):");
  console.log("  tinpig --path=my_project");
  console.log("  tinpig --path=\"my project\"");
  console.log("  tinpig --path=my\\ project");
  console.log("  tinpig --path=/home/keith/projects/my_project");
  console.log("  tinpig --path=~/projects/my_project");
  console.log("  tinpig --path=../my_project");
  console.log("\nWith template (will be prompted for path):");
  console.log("  tinpig --template=HTML");
  console.log("  tinpig --template=\"Custom Template\"");
  console.log("  tinpig --template=Custom\\ Template");
  console.log("\nWith path and template:");
  console.log("  tinpig --path=my_project --template=HTML");
  console.log("\nProject home: https://github.com/bit101/tinpig\n");
}

module.exports = { printBanner, displayHelp };
