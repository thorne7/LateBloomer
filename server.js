const mysql = require('mysql');
const inquirer = require('inquirer');
const DepartmentQueries = require('./queries/departmentQueries');
const RoleQueries = require('./queries/roleQueries');
const EmployeeQueries = require('./queries/employeeQueries');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lateBloomer_db'
  });

  // Create instances of query classes
const departmentQueries = new DepartmentQueries(connection);
// const roleQueries = new RoleQueries(connection);
// const employeeQueries = new EmployeeQueries(connection);
  
  // Establish a connection with the MySQL server
  connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the lateBloomer_db database.\n');
    // Start the application by prompting the user
    promptUser();
  });

const {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole
} = require('./queries');

// Function to prompt the user for their desired action
function promptUser() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    })
    .then(answer => {
      switch (answer.action) {
        case 'View all departments':
            departmentQueries.viewAllDepartments()
            .then(departments => {
              console.log(departments);
            })
            .catch(err => {
              console.error(err);
            });
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Goodbye!');
          connection.end();
          break;
      }
    });
}

module.export = connection