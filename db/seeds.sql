USE employeeTable;
INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Development'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Executive', 100000, 1),
    ('Sales Specialist', 80000, 1),
    ('Lead Computer Programmer', 250000, 2),
    ('Software Developer', 320000, 2),
    ('Product Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Manager', 250000, 4),
    ('Lawyer', 190000, 4),
    ('Associate', 175000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Smith', 1, NULL),
    ('Mary', 'Jane', 2, 1),
    ('Peter', 'Parker', 3, NULL),
    ('Michael', 'Scott', 4, 1),
    ('Jim', 'Halpert', 5, NULL),
    ('Jessica', 'Pearson', 6, 1),
    ('Donna', 'Paulson', 7, NULL),
    ('Prue', 'Leith', 8, 1),
    ('Lynn', 'Jensen', 9, NULL);