class DepartmentQueries {
  constructor(connection) {
    this.connection = connection;
  }

  viewAllDepartments() {
    const query = 'SELECT * FROM departments';

    return new Promise((resolve, reject) => {
      this.connection.query(query, (err, departments) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(departments);
      });
    });
  }

  addDepartment(department) {
    const getMaxIdQuery = 'SELECT MAX(id) AS maxId FROM departments';
    const insertQuery = 'INSERT INTO departments (id, department_name) VALUES (?, ?)';
    const { department_name } = department;

    return new Promise((resolve, reject) => {
      // Retrieve the maximum ID value
      this.connection.query(getMaxIdQuery, (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        const maxId = results[0].maxId || 0;
        const newId = maxId + 1;

        // Insert the new department with the generated ID
        this.connection.query(insertQuery, [newId, department_name], (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(result);
        });
      });
    });
  }
}

module.exports = DepartmentQueries;