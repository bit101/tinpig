const fs = require("fs-extra");
const path = require("path");

function resolveHome(filepath) {
  if (filepath[0] === '~') {
    return path.join(process.env.HOME, filepath.slice(1));
  }
  return filepath;
}

function checkPathExists(filePath) {
  return fs.pathExistsSync(resolveHome(filePath));
}

function checkPathAccess(filePath) {
  const parentDir = path.dirname(resolveHome(filePath));
  try {
    fs.accessSync(parentDir, fs.constants.W_OK);
  } catch (err) {
    return false;
  }
  return true;
}

function validatePathOrExit(filePath) {
  if (filePath) {
    if (checkPathExists(filePath)) {
      console.log(`\nSorry, something already exists at '${filePath}'. Try a different path.`);
      process.exit();
    }
    if (!checkPathAccess(filePath)) {
      console.log(`\nSorry, you don't have access to create a project at '${filePath}'. Try a different path.`);
      process.exit();
    }
  }
}

function validatePath(filePath) {
  if (filePath) {
    if (checkPathExists(filePath)) {
      return `'${filePath}' already exists.`;
    }
    if (!checkPathAccess(filePath)) {
      return `You don't have access to '${filePath}'.`;
    }
  }
  return true;
}

module.exports = {
  resolveHome,
  validatePathOrExit,
  validatePath,
};
