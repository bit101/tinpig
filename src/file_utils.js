const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");

function resolveHome(filepath) {
  if (filepath[0] === '~') {
    return path.join(process.env.HOME, filepath.slice(1));
  }
  return filepath;
}

function isDir(thePath) {
  return fs.statSync(thePath).isDirectory();
}

async function checkPathAccess(filePath) {
  const parentDir = path.dirname(resolveHome(filePath));
  try {
    await fs.access(parentDir, fs.constants.W_OK);
  } catch (err) {
    return false;
  }
  return true;
}

async function validatePathOrExit(filePath) {
  if (filePath) {
    const exists = await fs.pathExists(resolveHome(filePath));
    if (exists && !isDir(filePath)) {
      console.log(`\nSorry, there is an existing file at '${filePath}'. Try a different path.`);
      process.exit();
    }
    const hasAccess = await checkPathAccess(filePath);
    if (!hasAccess) {
      console.log(`\nSorry, you don't have access to create a project at '${filePath}'. Try a different path.`);
      process.exit();
    }
  }
}

async function validatePath(filePath) {
  if (!filePath) {
    return "Project path cannot be empty.";
  }
  const exists = await fs.pathExists(resolveHome(filePath));
  if (exists && !isDir(filePath)) {
    return `There is an existing file at '${filePath}'.`;
  }
  const hasAccess = await checkPathAccess(filePath);
  if (!hasAccess) {
    return `You don't have access to '${filePath}'.`;
  }
  return true;
}

async function warnExistingDir(filePath) {
  if (!filePath || filePath === "") {
    return;
  }
  const exists = await fs.pathExists(resolveHome(filePath));
  if (exists && isDir(filePath)) {
    console.log(`\nWarning: The path '${filePath}' is an existing directory.`);
    console.log("Existing files in this directory will NOT be removed or changed.");
    console.log("But they may prevent the new project from being successfully created.\n");
    const prompt = [{
      type: "confirm",
      name: "ok",
      message: "Use this directory",
      prefix: "",
      suffix: "?",
    }];
    const answer = await inquirer.prompt(prompt);
    if (!answer.ok) {
      process.exit();
    }
  }
}

module.exports = {
  resolveHome,
  validatePathOrExit,
  validatePath,
  warnExistingDir,
  isDir,
};
