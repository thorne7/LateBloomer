require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const DepartmentQueries = require('./queries/departmentQueries');
const EmployeeQueries = require('./queries/employeeQueries');
const RoleQueries = require('./queries/roleQueries');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'lateBloomer_db'
});

// Create instances of query classes
const departmentQueries = new DepartmentQueries(connection);
const roleQueries = new RoleQueries(connection);
const employeeQueries = new EmployeeQueries(connection);

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
  updateEmployeeRole,
  updateEmployeeManager
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
        'Update an employee manager',
        'Exit'
      ]
    })
    .then(answer => {
      switch (answer.action) {
        case 'View all departments':
          departmentQueries.viewAllDepartments()
            .then(departments => {
              console.table(departments);
              promptUser();
            })
            .catch(err => {
              console.error(err);
              promptUser();
            });
          break;

        case 'Add a department':
          inquirer
            .prompt({
              name: 'department_name',
              type: 'input',
              message: 'Enter the department name:'
            })
            .then(answer => {
              const department = {
                department_name: answer.department_name
              };

              departmentQueries.addDepartment(department)
                .then(result => {
                  console.log('Department added successfully!');
                  promptUser();
                })
                .catch(err => {
                  console.log(err);
                  promptUser();
                });
            });
          break;

        case 'View all employees':
          employeeQueries.viewAllEmployees()
            .then(employees => {
              console.table(employees);
              promptUser();
            })
            .catch(err => {
              console.error(err);
              promptUser();
            });
          break;

        case 'Add an employee':
          inquirer
            .prompt([{
                name: 'first_name',
                type: 'input',
                message: "Enter the employee's first name:",
              },
              {
                name: 'last_name',
                type: 'input',
                message: "Enter the employee's last name:",
              },
              {
                name: 'role_id',
                type: 'input',
                message: "Enter the employee's role ID:",
              },
              {
                name: 'manager_id',
                type: 'input',
                message: "Enter the employee's manager ID:",
              },
            ])
            .then(answer => {
              const employee = {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: answer.manager_id,
              };

              employeeQueries.addEmployee(employee)
                .then(result => {
                  console.log('Employee added successfully!');
                  promptUser();
                })
                .catch(err => {
                  console.error(err);
                  promptUser();
                });
            });
          break;

        case 'View all roles':
          roleQueries.viewAllRoles()
            .then(roles => {
              console.table(roles);
              promptUser();
            })
            .catch(err => {
              console.error(err);
              promptUser();
            });
          break;

        case 'Add a role':
          roleQueries
            .getAllRoles()
            .then(roles => {
              inquirer
                .prompt([{
                    name: 'title',
                    type: 'input',
                    message: 'Enter the role title:',
                  },
                  {
                    name: 'salary',
                    type: 'input',
                    message: 'Enter the role salary:',
                  },
                  {
                    name: 'department_id',
                    type: 'input',
                    message: 'Enter the department ID:',
                  },
                ])
                .then(answer => {
                  const {
                    title,
                    salary,
                    department_id
                  } = answer;

                  roleQueries
                    .addRole({
                      title,
                      salary,
                      department_id
                    })
                    .then(result => {
                      console.log('Role added successfully!');
                      promptUser();
                    })
                    .catch(err => {
                      console.error(err);
                      promptUser();
                    });
                });
            })
            .catch(err => {
              console.error(err);
              promptUser();
            });
          break;

        case 'Update an employee role':
          employeeQueries
            .getAllEmployees()
            .then(employees => {
              roleQueries
                .getAllRoles()
                .then(roles => {
                  inquirer
                    .prompt([{
                        name: 'employee',
                        type: 'list',
                        message: 'Select an employee:',
                        choices: employees.map(employee => ({
                          name: employee.full_name,
                          value: employee.id,
                        })),
                      },
                      {
                        name: 'role',
                        type: 'list',
                        message: 'Select a role:',
                        choices: roles.map(role => ({
                          name: role.title,
                          value: role.id,
                        })),
                      },
                    ])
                    .then(answer => {
                      const {
                        employee,
                        role
                      } = answer;

                      employeeQueries
                        .updateEmployeeRole(employee, role)
                        .then(result => {
                          console.log('Employee role updated successfully!');
                          promptUser();
                        })
                        .catch(err => {
                          console.error(err);
                          promptUser();
                        });
                    });
                })
                .catch(err => {
                  console.error(err);
                  promptUser();
                });
            })
            .catch(err => {
              console.error(err);
              promptUser();
            });
          break;

          case 'Update an employee manager':
            employeeQueries.getAllEmployees()
              .then(employees => {
                inquirer.prompt([
                  {
                    name: 'employeeId',
                    type: 'list',
                    message: 'Select an employee:',
                    choices: employees.map(employee => ({
                      name: employee.full_name,
                      value: employee.id,
                    })),
                  },
                  {
                    name: 'managerId',
                    type: 'list',
                    message: 'Select the new manager:',
                    choices: employees.map(manager => ({
                      name: employees.manager_name,
                      value: manager.id,
                    })),
                  },
                ])
                .then(answer => {
                  const { employeeId, managerId } = answer;
          
                  employeeQueries.updateEmployeeManager(employeeId, managerId)
                    .then(result => {
                      console.log('Employee manager updated successfully!');
                      promptUser();
                    })
                    .catch(err => {
                      console.error(err);
                      promptUser();
                    });
                })
                .catch(err => {
                  console.error(err);
                  promptUser();
                });
              })
              .catch(err => {
                console.error(err);
                promptUser();
              });
            break;

      }
    });
}

module.export = connection