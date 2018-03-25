const inquirer = require("inquirer");

function getTemplateChoice(templates) {
  const templateNames = templates.map(template => template.name);
  const exitPrompt = ">> Exit <<";
  templateNames.push(exitPrompt);
  return inquirer.prompt([{
    type: "list",
    name: "choice",
    message: "\nChoose a template",
    choices: templateNames,
    prefix: "",
    suffix: ":",
  }])
    .then((result) => {
      if (result.choice === exitPrompt) {
        process.exit();
      }
      return templates.find(template => template.name === result.choice);
    });
}

module.exports = getTemplateChoice;
