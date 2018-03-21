// use-strict

const TINPIG_DIR = `${process.env.HOME}/.config/tinpig`;
const constants = {
  TINPIG_DIR,
  CONFIG_FILE: `${TINPIG_DIR}/config`,
  TEMPLATES_DIR: `${TINPIG_DIR}/templates`,
  SAMPLE_PROJECTS: `${__dirname}/../templates`,
};

module.exports = constants;
