DROP DATABASE IF EXISTS employeeSchemaDB;

CREATE DATABASE employeeSchemaDB;

USE employeeSchemaDB;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1,null);

INSERT INTO role(title, salary, department_id)
VALUES ("Sales Lead", 100000,1);
INSERT INTO role(title, salary, department_id)
VALUES ("Salesperson", 80000,1);
INSERT INTO role(title, salary, department_id)
VALUES ("Lead Engineer", 150000,1);
INSERT INTO role(title, salary, department_id)
VALUES ("Software Engineer", 120000,1);
INSERT INTO role(title, salary, department_id)
VALUES ("Account Manager", 75000,1);
INSERT INTO role(title, salary, department_id)
VALUES ("Accountant", 125000,1);
INSERT INTO role(title, salary, department_id)
VALUES ("Legal Team Lead", 250000,1);

INSERT INTO department(name)
VALUES ("Sales");
INSERT INTO department(name)
VALUES ("Engineering");
INSERT INTO department(name)
VALUES ("Finance");
INSERT INTO department(name)
VALUES ("Legal");