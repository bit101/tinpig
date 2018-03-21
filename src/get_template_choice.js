const readline = require("readline");

function getTemplateChoice(templates) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("\nAvailable templates:\n");

    for (let i = 0; i < templates.length; i++) {
      console.log(`${i + 1}. ${templates[i].name}`);
    }

    rl.question("\nChoice (q = quit): ", (answer) => {
      rl.close();
      if (answer.toLowerCase() === "q") {
        return;
      }
      if (answer < "1" || answer > templates.length.toString()) {
        console.log(`${answer} is not a valid choice. Choose a number from 1 to ${this.templates.length}.`);
      } else {
        resolve(templates[answer - 1]);
      }
    });
  });
}

module.exports = getTemplateChoice;
