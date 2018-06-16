// use-strict
const os = require("os");

const TINPIG_DIR = `${os.homedir()}/.config/tinpig`;
const constants = {
  TINPIG_DIR,
  CONFIG_FILE: `${TINPIG_DIR}/config`,
  SAMPLE_PROJECTS: `${__dirname}/../templates`,
};

module.exports = constants;
