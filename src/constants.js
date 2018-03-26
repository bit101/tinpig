// use-strict

const TINPIG_DIR = `${process.env.HOME}/.config/tinpig`;
const constants = {
  TINPIG_DIR,
  CONFIG_FILE: `${TINPIG_DIR}/config`,
  SAMPLE_PROJECTS: `${__dirname}/../templates`,
};

module.exports = constants;
