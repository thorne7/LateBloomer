class RoleQueries {
    constructor(connection) {
        this.connection = connection;
    }

    viewAllRoles() {
        const query = `
    SELECT 
    r.id,
    r.title,
    r.salary,
    d.department_name AS department
    FROM
    roles r
    INNER JOIN departments d On r.department_id = d.id
    `;

        return new Promise((resolve, reject) => {
            this.connection.query(query, (err, roles) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(roles);
            });
        });
    }

    getAllRoles() {
        const query = 'SELECT id, title FROM roles';

        return new Promise((resolve, reject) => {
            this.connection.query(query, (err, roles) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(roles);
            });
        });
    }

    addRole(role) {
        const getMaxIdQuery = 'SELECT MAX(id) AS maxId FROM roles';
        const insertQuery = 'INSERT INTO roles (id, title, salary, department_id) VALUES (?, ?, ?, ?)';
        const {
            title,
            salary,
            department_id
        } = role;

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
                    [newId, title, salary, department_id],
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
}

module.exports = RoleQueries;