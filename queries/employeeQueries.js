class EmployeeQueries {
  constructor(connection) {
    this.connection = connection;
  }

  viewAllEmployees() {
    const query = `
          SELECT
            e.id,
            e.first_name,
            e.last_name,
            r.title AS role,
            d.department_name AS department,
            r.salary,
            CONCAT(m.first_name, ' ', m.last_name) AS manager
          FROM
            employees e
            LEFT JOIN roles r ON e.role_id = r.id
            LEFT JOIN departments d ON r.department_id = d.id
            LEFT JOIN employees m ON e.manager_id = m.id
        `;


    return new Promise((resolve, reject) => {
      this.connection.query(query, (err, employees) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(employees);
      });
    });
  }

  addEmployee(employee) {
    const getMaxIdQuery = 'SELECT MAX(id) AS maxId FROM employees';
    const insertQuery = 'INSERT INTO employees (id, first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?, ?)';
    const {
      first_name,
      last_name,
      role_id,
      manager_id
    } = employee;

    return new Promise((resolve, reject) => {
      this.connection.query(getMaxIdQuery, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        const maxId = result[0].maxId || 0;
        const newId = maxId + 1;

        this.connection.query(
          insertQuery,
          [newId, first_name, last_name, role_id, manager_id],
          (err, result) => {
            if (err) {
              reject(err);
              return;
            }

            resolve(result);
          }
        );
      });
    });
  }

  updateEmployeeRole(employeeId, roleId) {
    const updateQuery = 'UPDATE employees SET role_id = ? WHERE id = ?';

    return new Promise((resolve, reject) => {
      this.connection.query(updateQuery, [roleId, employeeId], (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }

  updateEmployeeManager(employeeId, managerId) {
    const query = 'UPDATE employees SET manager_id = ? WHERE id = ?';
  
    return new Promise((resolve, reject) => {
      this.connection.query(query, [managerId, employeeId], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
  
        resolve(result);
      });
    });
  }

  getAllManagers() {
    const query = `
      SELECT DISTINCT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
      FROM employees e
      JOIN employees m ON e.manager_id = m.id
    `;

    return new Promise((resolve, reject) => {
      this.connection.query(query, (err, managers) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(managers);
      });
    });
  }

  getAllEmployees() {
    const query = `
      SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees
    `;

    return new Promise((resolve, reject) => {
      this.connection.query(query, (err, employees) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(employees);
      });
    });
  }
}

module.exports = EmployeeQueries;