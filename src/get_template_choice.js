const inquirer = require("inquirer");

async function getTemplateChoice(templates) {
  const templateNames = templates.map(template => template.name);
  const exitPrompt = ">> Exit <<";
  templateNames.push(exitPrompt);
  const choices = [{
    type: "list",
    name: "choice",
    message: "\nChoose a template",
    choices: templateNames,
    pageSize: 20,
    prefix: "",
    suffix: ":",
  }];

  const result = await inquirer.prompt(choices);
  if (result.choice === exitPrompt) {
    process.exit();
  }
  return templates.find(template => template.name === result.choice);
}

module.exports = getTemplateChoice;
