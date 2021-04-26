const mysql = require('mysql');
const inquirer = require("inquirer");
const ck = require('chalk');
const { registerPrompt } = require('inquirer');
let listRoles = [];
let listEmployee = [];
let listDepartment = [];

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  password: 'password',
  database: 'employeeSchemaDB',
});

function viewQuery (queryString, queryTitle) {
  connection.query(queryString, (err, res) => {
    if (err) throw err;
    console.log("\n"+queryTitle);
    console.table(res);
  });
  askQuestion();
}

function removeEmployee() {
    listEmployee = [];
    const query = 'SELECT * FROM employee';
    connection.query(query, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            let newName = res[i].id + " " +res[i].first_name + " " + res[i].last_name;
            listEmployee.push (newName);
        }
    listEmployee.push ("[ CANCEL ]");  //give the option to cancel a removal
    inquirer.prompt([
        {
            message: "Who do you want to remove?",
            type: "list",
            name: "roleAssign",
            choices: listEmployee
        }
    ]).then(({roleAssign}) => {
        if (roleAssign != "[ CANCEL ]") {
            let delID = parseInt(roleAssign);
            const query = `DELETE FROM employee WHERE id=${delID}`;
            connection.query(query, (err, res) => {
                console.info(ck.red(`Removed employee ID`+roleAssign));
            })
        } else {
            console.info(ck.bgRed(`[Did not Remove]`));            
        }
        askQuestion();
    })
    })
}

function addEmployee() {
    listRoles = [];
    const query = 'SELECT * FROM role';
    connection.query(query, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            let newRole = res[i].id + " " +res[i].title;
            listRoles.push (newRole);
        }
    });
    inquirer.prompt([
        {
            message: "What is the employee's first name?",
            type: "input",
            name: "addFirstName",
        },
        {
            message: "What is the employee's last name?",
            type: "input",
            name: "addLastName",
        },
        {
            message: "What is the employee's role?",
            type: "list",
            name: "roleAssign",
            choices: listRoles
        }
    ]).then(({addFirstName,addLastName,roleAssign}) => {
        let newID = parseInt(roleAssign);
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${addFirstName}", "${addLastName}", ${newID},null);`;
        connection.query(query, (err, res) => {
        console.info(ck.green(`added new employee`));
        askQuestion();
        })
        
    })
}

function addRole() {
    listDepartment = [];
    const query = 'SELECT name FROM department';
    connection.query(query, (err, res) => {
        res.forEach(({ name }) => listDepartment.push(name));
    });
    inquirer.prompt([
        {
            message: "Please choose what role to add:",
            type: "input",
            name: "addRoleTitle",
        },
        {
            message: "Please enter role's salary:",
            type: "input",
            name: "addRoleSalary",
        },
        {
            message: "Please choose what department this will join:",
            type: "list",
            name: "addRoleDepartment",
            choices: listDepartment
        },
    ]).then(({addRoleTitle,addRoleSalary,addRoleDepartment}) => {
        let numSal = parseFloat(addRoleSalary);
        let depID;
        let query = `SELECT id FROM department WHERE name = "${addRoleDepartment}";`;
        connection.query(query, (err, res) => {
            depID = res[0].id;
            query = `INSERT INTO role (title, salary, department_id) VALUES ("${addRoleTitle}", ${numSal}, ${depID});`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.info(ck.green(`added new role of: `+addRoleTitle));
                askQuestion();
            })
    
        });
    })
}

function removeRole() {
    listRoles = [];
    const query = 'SELECT * FROM role';
    connection.query(query, (err, res) => {

        for (let i = 0; i < res.length; i++) {
            let newRole = res[i].id + " " +res[i].title;
            listRoles.push (newRole);
        }
        listRoles.push ("[ CANCEL ]");  //give the option to cancel a removal
        inquirer.prompt([
        {
            message: "What role do you want to remove?",
            type: "list",
            name: "roleAssign",
            choices: listRoles
        }
        ]).then(({roleAssign}) => {
        if (roleAssign != "[ CANCEL ]") {
            let delID = parseInt(roleAssign);
            const query = `DELETE FROM role WHERE id=${delID}`;
            connection.query(query, (err, res) => {
                console.info(ck.red(`Removed role ID #`+roleAssign));
            })
        } else {
            console.info(ck.bgRed(`[Did not Remove]`));            
        }
        askQuestion();
       })
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            message: "Please enter the new Department name:",
            type: "input",
            name: "addDepartmentName",
        },
    ]).then(({addDepartmentName}) => {
        const query = `INSERT INTO department (name) VALUES ("${addDepartmentName}");`;
        connection.query(query, (err, res) => {
            console.info(ck.green(`added new department`));
            askQuestion();
        })
        
    })
}

function removeDepartment() {
    listDepartment = [];
    const query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            let newDepartment = res[i].id + " " +res[i].name;
            listDepartment.push (newDepartment);
        }
        listDepartment.push ("[ CANCEL ]");  //give the option to cancel a removal
        inquirer.prompt([
        {
            message: "What Department do you want to remove?",
            type: "list",
            name: "departmentAssign",
            choices: listDepartment
        }
        ]).then(({departmentAssign}) => {
        if (departmentAssign != "[ CANCEL ]") {
            let delID = parseInt(departmentAssign);
            const query = `DELETE FROM department WHERE id=${delID}`;
            connection.query(query, (err, res) => {
                console.info(ck.red(`Removed Department ID #`+departmentAssign));
            })
        } else {
            console.info(ck.bgRed(`[Did not Remove]`));            
        }
        askQuestion();
       })
    });
}

//assign Manager
function updateManager() {
    listEmployee = [];
    const query = 'SELECT * FROM employee';
    connection.query(query, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            let newName = res[i].id + " " +res[i].first_name + " " + res[i].last_name;
            listEmployee.push (newName);
        }
        inquirer.prompt([
            {
                message: "Who needs to change Managers?",
                type: "list",
                name: "employee",
                choices: listEmployee
            },
            {
                message: "Who is their new Manager?",
                type: "list",
                name: "manager",
                choices: listEmployee
            }
        ]).then(({employee, manager}) => {
            let empID = parseInt(employee);
            let manID = parseInt(manager);
            const query = `UPDATE employee SET employee.manager_id = ${manID} WHERE employee.id = ${empID}`;
            connection.query(query, (err, res) => {
                console.info(ck.red(`Updated Manager for `+employee+` to `+manager));
            })
            askQuestion();
        })
    })
}

//assign Role to Employee
function updateRole() {
    listRoles = [];
    listEmployee = [];

    let query = 'SELECT * FROM role';
    connection.query(query, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            let newRole = res[i].id + " " +res[i].title;
            listRoles.push (newRole);
        }
        listRoles.push ("[ CANCEL ]");  //give the option to cancel a removal
    })
    query = 'SELECT * FROM employee';
    connection.query(query, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            let newName = res[i].id + " " +res[i].first_name + " " + res[i].last_name;
            listEmployee.push (newName);
        }
        listRoles.push ("[ CANCEL ]");  //give the option to cancel a removal
        inquirer.prompt([
            {
                message: "Who needs to change Roles?",
                type: "list",
                name: "employee",
                choices: listEmployee
            },
            {
                message: "What will be their new Role?",
                type: "list",
                name: "role",
                choices: listRoles
            }
        ]).then(({employee, role}) => {
            if (role != "[ CANCEL ]") {
                let empID = parseInt(employee);
                let roleID = parseInt(role);
                const query = `UPDATE employee SET employee.role_id = ${roleID} WHERE employee.id = ${empID}`;
                connection.query(query, (err, res) => {
                    console.info(ck.red(`Updated Role for `+employee+` to be a `+role));
                })
            }
            askQuestion();
        })
    })
}

//change the department for a role
function updateRoleDepartment() {
    listRoles = [];
    listDepartment = [];

    let query = 'SELECT * FROM role';
    connection.query(query, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            let newRole = res[i].id + " " +res[i].title;
            listRoles.push (newRole);
        }
    })
    query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            let newDepartment = res[i].id + " " +res[i].name;
            listDepartment.push (newDepartment);
        }
        listDepartment.push ("[ CANCEL ]");  //give the option to cancel a selection
        inquirer.prompt([
            {
                message: "What Role needs to change Departments?",
                type: "list",
                name: "role",
                choices: listRoles
            },
            {
                message: "What will be their new Department?",
                type: "list",
                name: "department",
                choices: listDepartment
            }
        ]).then(({role, department}) => {
            if (department != "[ CANCEL ]") {
                let roleID = parseInt(role);
                let depID = parseInt(department);
                const query = `UPDATE role SET role.department_id = ${depID} WHERE role.id = ${roleID}`;
                connection.query(query, (err, res) => {
                    console.info(ck.red(`Updated Department for `+role+` to be part of `+department));
                })
            }
            askQuestion();
        })
    })
}

//employee submenu for Employee specific tasks
function employeeQuestions() {
    inquirer.prompt([
        {
            message: "What would you like to do?",
            type: "list",
            name: "doNext",
            choices: ["Add Employee", "Remove Employee",  "Update Employee Role",  "Update Employee Manager", "[ Return to main menu ]"]
        }
    ]).then(answers => {
        console.log("\n")
        switch (answers.doNext) {
            case "Add Employee":
                addEmployee();  //done
                break;
            case "Remove Employee":
                removeEmployee();  //done
                break;
            case "Update Employee Role":
                updateRole();  //"Update Employee Role" 
                break;
            case "Update Employee Manager":
                updateManager();  // "Update Employee Manager" - DONE
                break;
            default: 
                askQuestion();
                break;
        }
    })
}

//role submenu for role tasks 
function roleQuestions() {
    inquirer.prompt([
        {
            message: "What would you like to do?",
            type: "list",
            name: "doNext",
            choices: ["View Roles", "Add Role", "Remove Role",  "Update Role Department", "[ Return to main menu ]"]
        }
    ]).then(answers => {
        console.log("\n")
        switch (answers.doNext) {
            case "View Roles":  //done
                viewQuery('SELECT role.id, role.title AS "Role Title", department.name AS "Department Name", department.id AS "dID" FROM role INNER JOIN department ON (role.department_id = department.id) ', 'Current Roles:');
                break;
            case "Add Role":  //done
                addRole();
                break;
            case "Remove Role":  //done
                removeRole();
                break;
            case "Update Role Department":  //done
                updateRoleDepartment();
                break;
            default: 
                askQuestion();
                break;
        }
    })
}

//Department submenu for department tasks 
function departmentQuestions() {
    inquirer.prompt([
        {
            message: "What would you like to do?",
            type: "list",
            name: "doNext",
            choices: ["View Departments", "Add Departments", "Remove Departments", "Budget by Department",  "[ Return to main menu ]"]
        }
    ]).then(answers => {
        console.log("\n")
        switch (answers.doNext) {
            case "View Departments":  //done
                viewQuery('SELECT * FROM department', 'Departments List:');
                break;
            case "Add Departments":  //done
                addDepartment();
                break;
            case "Remove Departments":  //done
                removeDepartment();
                break;
            case "Budget by Department":  //done
                viewQuery(`SELECT department.name AS "Department", CONCAT("$",FORMAT(sum(role.salary),2)) AS "Total Salary" FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) GROUP BY department.id ORDER BY sum(role.salary) DESC`,`Budget (by Department):`);
                break;
            default: 
                askQuestion();
                break;
        }
    })
}


const askQuestion = () => {
    inquirer.prompt([
        {
            message: "What would you like to do?",
            type: "list",
            name: "doNext",
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "[EMPLOYEE] options", "[ROLE] options", "[DEPARTMENT] options", "Exit"]
        }
    ]).then(answers => {
        console.log("\n")
        switch (answers.doNext) {
            case "View All Employees":  //done
                viewQuery('SELECT employee.id, employee.first_name AS "First Name", employee.last_name AS "Last Name", employee.manager_id, role.title, CONCAT("$",FORMAT(role.salary,2)) AS "Salary" FROM employee INNER JOIN role ON (employee.role_id = role.id)', 'View All Employees:');
                break;
            case "View All Employees By Department":
                viewQuery('SELECT employee.id, employee.first_name AS "First Name", employee.last_name AS "Last Name", employee.manager_id, role.title, role.salary, department.name AS "Department" FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) ORDER BY department.name ASC', 'View All Employees (By Department):');
                break;
            case "View All Employees By Manager":
                viewQuery(`SELECT CONCAT(m.first_name, " ", m.last_name) AS 'Manager', CONCAT(e.first_name, " ", e.last_name) AS 'Employee Name' FROM employee e INNER JOIN employee m ON (m.id = e.manager_id) ORDER BY Manager`,`View Employees (by Manager):`);
                break;
            case "[EMPLOYEE] options":
                employeeQuestions();  //done
                break;
            case "[ROLE] options":  //done
                roleQuestions();
                break;
            case "[DEPARTMENT] options":
                departmentQuestions();  //done
                break;
            case "Exit":
                console.log(ck.blue('Thanks for visiting!'));
                connection.end();
                break;
            default: askQuestion();
                break;
        }
    })
}

// Connect to the DB
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    askQuestion();
});