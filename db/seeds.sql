-- Populate departments
INSERT INTO department (id, name)
VALUES
  (1, 'Sales'),
  (2, 'Marketing'),
  (3, 'Engineering');

-- Populate roles
INSERT INTO role (id, title, salary, department_id)
VALUES
  (1, 'Sales Manager', 50000.00, 1),
  (2, 'Sales Representative', 30000.00, 1),
  (3, 'Marketing Manager', 55000.00, 2),
  (4, 'Marketing Coordinator', 35000.00, 2),
  (5, 'Software Engineer', 60000.00, 3),
  (6, 'QA Engineer', 45000.00, 3);

  -- Populate employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
  (1, 'Hollis', 'Mason', 1, NULL),
  (2, 'Sally', 'Jupiter', 2, 1),
  (3, 'Walter', 'Kovacs', 3, NULL),
  (4, 'Jon', 'Osterman', 4, 3),
  (5, 'Adrian', 'Veidt', 5, NULL),
  (6, 'Edward', 'Morgan', 6, 5);