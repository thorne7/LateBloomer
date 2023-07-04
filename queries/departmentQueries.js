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
  }
  
  module.exports = DepartmentQueries;
  