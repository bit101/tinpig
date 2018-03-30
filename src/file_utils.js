const fs = require("fs-extra");
const path = require("path");

function resolveHome(filepath) {
  if (filepath[0] === '~') {
    return path.join(process.env.HOME, filepath.slice(1));
  }
  return filepath;
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
    if (exists) {
      console.log(`\nSorry, something already exists at '${filePath}'. Try a different path.`);
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
  if (exists) {
    return `'${filePath}' already exists.`;
  }
  const hasAccess = await checkPathAccess(filePath);
  if (!hasAccess) {
    return `You don't have access to '${filePath}'.`;
  }
  return true;
}

module.exports = {
  resolveHome,
  validatePathOrExit,
  validatePath,
};
