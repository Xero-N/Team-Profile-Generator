const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

const teamMembers = [];

//Manager Questions
const promptManagerInfo = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the team manager's name?",
        validate: validateInput,
      },
      {
        type: "input",
        name: "managerId",
        message: "Enter the team manager's ID.",
        validate: validateInput,
      },
      {
        type: "input",
        name: "email",
        message: "What is the team manager's email?",
        validate: validateInput,
      },
      {
        type: "input",
        name: "officeNumber",
        message: "What is the team manager's office number?",
        validate: validateInput,
      },
    ])
    .then((answers) => {
      const manager = new Manager(
        answers.name,
        answers.managerId,
        answers.email,
        answers.officeNumber
      );
      teamMembers.push(manager);
      promptMenu(); // Move to the next step in the menu
    });
};

// Engineer Questions
const promptEngineerInfo = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the engineer's name?",
        validate: validateInput,
      },
      {
        type: "input",
        name: "engineerId",
        message: "Enter the engineer's employee ID.",
        validate: validateInput,
      },
      {
        type: "input",
        name: "email",
        message: "What is the engineer's email?",
        validate: validateInput,
      },
      {
        type: "input",
        name: "github",
        message: "Enter the engineer's GitHub username",
        validate: validateInput,
      },
    ])
    .then((answers) => {
      const engineer = new Engineer(
        answers.name,
        answers.engineerId,
        answers.email,
        answers.github
      );
      teamMembers.push(engineer);
      promptMenu(); // Move to the next step in the menu
    });
};

// Intern Questions
const promptInternInfo = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the intern's name?",
        validate: validateInput,
      },
      {
        type: "input",
        name: "internId",
        message: "Enter the intern's employee ID.",
        validate: validateInput,
      },
      {
        type: "input",
        name: "email",
        message: "What is the intern's email?",
        validate: validateInput,
      },
      {
        type: "input",
        name: "school",
        message: "Enter the intern's school",
        validate: validateInput,
      },
    ])
    .then((answers) => {
      const intern = new Intern(
        answers.name,
        answers.internId,
        answers.email,
        answers.school
      );
      teamMembers.push(intern);
      promptMenu(); // Move to the next step in the menu
    });
};

// Validation function
const validateInput = (input) => {
  if (input.trim() === "") {
    return "This field is required";
  }
  return true;
};

// Start the process by prompting for manager details
promptManagerInfo();

// Prompt for the next action
const promptMenu = () => {
  return inquirer
    .prompt({
      type: "list",
      name: "choice",
      message: "What would you like to do next?",
      choices: ["Add an Engineer", "Add an Intern", "Finish building the team"],
    })
    .then((answer) => {
      switch (answer.choice) {
        case "Add an Engineer":
          return promptEngineerInfo();
        case "Add an Intern":
          return promptInternInfo();
        case "Finish building the team":
          return generateHTML();
      }
    });
};

// Function to generate HTML using the render function and write it to a file
function generateHTML() {
  const html = render(teamMembers);
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  try {
    fs.writeFileSync(outputPath, html);
    console.log(`Team HTML generated at ${outputPath}`);
  } catch (err) {
    console.error("Error writing HTML file:", err);
  }
}
