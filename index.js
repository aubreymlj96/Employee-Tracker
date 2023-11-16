const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');
const db = require('./db/connection');

// Source for custom db header - https://texteditor.com/ascii-art/

db.connect(function (err) {
    if (err) {
        console.log(err)
    };
    console.log('You are currently connected');
    console.log(  
`┏━━━┓━━━━━━━━┏┓━━━━━━━━━━━━━━━━━━━━━━┏━━━┓━━━━━━┏┓━━━━━━┏┓━━━━━━━━━━━━━━━
┃┏━━┛━━━━━━━━┃┃━━━━━━━━━━━━━━━━━━━━━━┗┓┏┓┃━━━━━┏┛┗┓━━━━━┃┃━━━━━━━━━━━━━━━
┃┗━━┓┏┓┏┓┏━━┓┃┃━┏━━┓┏┓━┏┓┏━━┓┏━━┓━━━━━┃┃┃┃┏━━┓━┗┓┏┛┏━━┓━┃┗━┓┏━━┓━┏━━┓┏━━┓
┃┏━━┛┃┗┛┃┃┏┓┃┃┃━┃┏┓┃┃┃━┃┃┃┏┓┃┃┏┓┃━━━━━┃┃┃┃┗━┓┃━━┃┃━┗━┓┃━┃┏┓┃┗━┓┃━┃━━┫┃┏┓┃
┃┗━━┓┃┃┃┃┃┗┛┃┃┗┓┃┗┛┃┃┗━┛┃┃┃━┫┃┃━┫━━━━┏┛┗┛┃┃┗┛┗┓━┃┗┓┃┗┛┗┓┃┗┛┃┃┗┛┗┓┣━━┃┃┃━┫
┗━━━┛┗┻┻┛┃┏━┛┗━┛┗━━┛┗━┓┏┛┗━━┛┗━━┛━━━━┗━━━┛┗━━━┛━┗━┛┗━━━┛┗━━┛┗━━━┛┗━━┛┗━━┛
━━━━━━━━━┃┃━━━━━━━━━┏━┛┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
━━━━━━━━━┗┛━━━━━━━━━┗━━┛━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    )
    console.log('Employee Database');
    firstPrompt();
});

function firstPrompt() {
    inquirer.prompt({
        type: 'list',
        name: 'task',
        message: 'Available options below. Please select the preferred action',
        choices: [
            "View Employees",
            "View Departments",
            "View Roles",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
            "Add Role",
        ]
    })
        .then(function ({ task }) {
            switch (task) {
                case "View Employees":
                    viewEmployee();
                    break;
                case "View Departments":
                    viewDepartments();
                    break;
                case "View Roles":
                    viewRoles();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Add Role":
                    addRole();
                    break;
            }
        })
}

function viewEmployee() {
    console.log('Current List of Employees\n');

    const query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON m.id = e.manager_id;`

    db.query(query, function (err, res) {
        if (err) {
            console.log(err);
        };
        console.table(res);
        console.log("Employee View Successfully Generated\n");
        firstPrompt();
    })
};


function viewDepartments() {
    console.log('Current List of Departments\n');

    const query = `SELECT d.id, d.name
    FROM department d`

    db.query(query, function (err, res) {
        if (err) {
            console.log(err);
        };
        console.table(res);
        console.log("Department View Successfully Generated\n");
        firstPrompt();
        // promptDepartment(departmentChoices);
    })
};

function viewRoles() {
    console.log('Current List of Roles\n');

    const query = `SELECT r.id, r.department_id, d.name, r.title, r.salary
    FROM role r
    JOIN department d ON r.department_id = d.id`

    db.query(query, function (err, res){
        if (err){
            console.log(err)
        };
        console.table(res);
        console.log("Roles Succesfully Generated\n");
        firstPrompt();
    })
};

function promptDepartment(departmentChoices) {
    inquirer.prompt([{
        type: 'list',
        name: 'departmentId',
        message: 'Available departments below. Please select the preferred choice',
        choices: departmentChoices
    }])
        .then(function (answer) {
            console.log('answer', answer.department);
            const query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name
        FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON d.id = r.department_id
        WHERE d.id = ?`

            db.query(query, answer.department, function (err, res) {
                if (err) {
                    console.log(err);
                }
                console.table('response', res);
                console.log(res.affectRows + "Employees by Department Successfully Generated\n");

                firstPrompt();
            })

        })
};

function addEmployee() {
    console.log('Adding Employee');

    const query = `SELECT role.id, role.title FROM role`

    const managerQuery = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title 
    FROM employee
    JOIN role ON employee.role_id = role.id`

    db.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        const roleChoices = res.map(({ id, title }) => (
            `${id}. ${title}`
        ))

        console.table(res);
        console.log(roleChoices);
        db.query(managerQuery, function (managerError, managerRes) {
            if (managerError) {
                console.log(managerError);
            }
                const managerChoices = managerRes.map(({id, first_name, last_name, manager_id, title}) =>{
                        return `${id}. ${first_name} ${last_name} - ${title}`
                })
        
            console.log(managerChoices);
             promptInsert(roleChoices, managerChoices);
        })
    });
}

    function promptInsert(roleChoices, managerChoices) {
        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Please enter your employees first name'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Please enter your employees last name'
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Please enter your employees role',
                choices: roleChoices
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Please select for manager role',
                choices: managerChoices
            },
        ])
            .then(function (answer) {
                console.log(answer);

                const query = `INSERT INTO employee SET ?`
                db.query(query, {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role_id.split('.')[0],
                    manager_id: answer.manager_id.split('.')[0],
                },
                    function (err, res) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('Employee Inserted Successfully\n');
                        };
                        console.table(res);

                        firstPrompt();
                    }

                )
            })
    };

    function removeEmployee() {
        console.log('Deletion in Progress');

        const query = `SELECT e.id, e.first_name, e.last_name
    FROM employee e`

        db.query(query, function (err, res) {
            if (err) {
                console.log(err);
            };

            const deleteEmployee = res.map(({ id, first_name, last_name }) => ({
                value: id,
                name: `${id} ${first_name} ${last_name}`
            }));

            console.table(res);
            // console.log('Employee Deleted\n');

            promptDelete(deleteEmployee);
        })
    };

    function promptDelete(deleteEmployee) {
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Enter Employee to Remove',
                choices: deleteEmployee
            }
        ])
            .then(function (answer) {
                const query = `DELETE FROM employee WHERE ?`;
                db.query(query, { id: answer.employeeId }, function (err, res) {
                    if (err) {
                        console.log(err)
                    };

                    console.table(res);
                    console.log(res.affectedRows + 'Row Deleted\n');

                    firstPrompt();
                })
            })
    };

    function updateEmployeeRole() {
        employeeUpdate();
    };

    function employeeUpdate() {
        console.log('Updating Employee Now');

        const query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary
    FROM employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON d.id = r.department_id`

        db.query(query, function (err, res) {
            if (err) {
                console.log(err)
            };
            const employeeChoices = res.map(({ id, first_name, last_name }) => ({
                value: id,
                name: `${first_name} ${last_name}`
            }));

            console.table(res);
            console.log('Employee Successfully Updated\n');

            roleArray(employeeChoices);
        })
    };

    function roleArray(employeeChoices) {
        console.log('Updating Role');

        const query = `SELECT r.id, r.title, r.salary FROM role r`
        let roleChoices;

        db.query(query, function (err, res) {
            if (err) {
                console.log(err);
            };
            roleChoices = res.map(({ id, title, salary }) => ({
                value: id,
                title: `${title}`,
                salary: `${salary}`
            }));

            console.table(res);
            console.log('Role Successfully Updated\n');

            promptEmployeeRole(employeeChoices, roleChoices);
        })
    };

    function promptEmployeeRole(employeeChoices, roleChoices) {
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Please select employee to set role',
                choices: employeeChoices
            },
            {
                type: 'list',
                name: 'roleId',
                message: 'Select role to update',
                choices: roleChoices
            },
        ])
            .then(function (answer) {
                const query = `UPDATE employee e SET role_id = ? WHERE id =?`
                db.query(query,
                    [
                        answer.roleId,
                        answer.employeeId
                    ],
                    function (err, res) {
                        if (err) {
                            console.log(err)
                        };

                        console.table(res);
                        console.log(res.affectedRows + 'Updated Successfully \n');

                        firstPrompt();
                    })
            })
    };

    function addRole() {
        const query = `SELECT department.name, department.id
    FROM department`

        db.query(query, function (err, res) {
            if (err) {
                console.log(err)
            };
            const departmentChoices = res.map(({ id, name }) => ({
                value: id,
                name: `${id} ${name}`
            }));
            promptAddRole(departmentChoices);
        });
    };

    function promptAddRole(departmentChoices) {
        inquirer.prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'Enter role title'
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'Enter salary'
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'Select department',
                choices: departmentChoices
            },
        ])
            .then(function (answer) {
                const query = 'INSERT INTO role SET ?'

                db.query(query, {
                    title: answer.roleTitle,
                    salary: answer.roleSalary,
                    department_id: answer.departmentId
                },
                    function (err, res) {
                        if (err) {
                            console.log(err)
                        };
                        console.table(res);
                        console.log('Role Successfully Inserted\n');
                        addRole();
                        firstPrompt();
                    });
            });
    };