const departmentQueries = require('./departmentQueries');
const roleQueries = require('./roleQueries');
const employeeQueries = require('./employeeQueries');

module.exports = {
  ...departmentQueries,
  ...roleQueries,
  ...employeeQueries
};
