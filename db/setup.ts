import Database from 'better-sqlite3'

const db = Database('./db/data.db', { verbose: console.log })

const aplicants = [
  {
    name: 'Teodora Gjini',
    email:"teodoragjini@yahoo.com"
  },
  {
    name: 'Edi Rama',
    email:"edirama@gmail.com"
  },
]

const interviewers = [
  {
    name: 'Mona Lisa',
    email:"mona@mail.com",
    companyId:1
  },
  {
    name: 'Sali Berisha',
    email:"sali@yahoo.com",
    companyId:2
  },
]

const interviews = [
    {
      aplicantId: 1,
      interviewerId: 1,
      date:"05/09/2022",
      score: 10,
      successful: null,
    },
    {
      aplicantId: 1,
      interviewerId: 2,
      date:"10/08/2022",
      score: 7,
      successful: null,
    },
    {
      aplicantId: 2,
      interviewerId: 2,
      date:"05/09/2022",
      score: 9,
      successful: null,
    }
  ]

  const companies= [
    {
      name:"Balfin",
      city:"Tirana"
    },
    {
      name:"Classic Cars",
      city:"London"
    }
  ]

  const employees = [
    {
      name:"Renato Kapa",
      email:"renato@yahoo.com",
      position:"Senior Software Engineer",
      companyId: 2
    },
    {
      name:"Andre Gjini",
      email:"andre@gmail.com",
      position:"Digital Marketer",
      companyId:1
    },
    {
      name:"Spring Nice",
      email:"spring@yahoo.com",
      position:"Sale Agent",
      companyId:1
    }
  ]

const dropAplicantsTable = db.prepare(`DROP TABLE IF EXISTS aplicants;`)
dropAplicantsTable.run()

const createAplicantsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS aplicants (
  id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  PRIMARY KEY (id)
);
`)
createAplicantsTable.run()

const createAplicant = db.prepare(`
INSERT INTO aplicants (name, email) VALUES (@name, @email);
`)

for (let aplicant of aplicants) createAplicant.run(aplicant)

const dropInterviewersTable = db.prepare(`DROP TABLE IF EXISTS interviewers;`)
dropInterviewersTable.run()

const createInterviewersTable = db.prepare(`
CREATE TABLE IF NOT EXISTS interviewers (
  id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  companyId INTEGER,
  PRIMARY KEY (id)
);
`)
createInterviewersTable.run()

const createInterviewer = db.prepare(`
INSERT INTO interviewers (name, email, companyId) VALUES (@name, @email, @companyId);
`)
for (let interviewer of interviewers) createInterviewer.run(interviewer)

// What links them together?

const dropInterviewsTable = db.prepare(`
DROP TABLE IF EXISTS interviews;
`)

dropInterviewsTable.run()

const createInterviewsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS interviews (
  id INTEGER,
  interviewerId INTEGER,
  aplicantId INTEGER,
  date TEXT NOT NULL,
  score INTEGER NOT NULL,
  successful INTEGER,
  PRIMARY KEY (id),
  FOREIGN KEY (interviewerId) REFERENCES interviews(id) ON DELETE CASCADE,
  FOREIGN KEY (aplicantId) REFERENCES aplicants(id) ON DELETE CASCADE
);
`)

createInterviewsTable.run()

const createInterview = db.prepare(`
INSERT INTO interviews (aplicantId, interviewerId, date, score) VALUES (@aplicantId, @interviewerId, @date, @score);
`)

for (let interview of interviews) createInterview.run(interview)

const dropCompaniesTable = db.prepare(`
DROP TABLE IF EXISTS companies;
`)
dropCompaniesTable.run()

const createCompaniesTable = db.prepare(`
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  PRIMARY KEY (id)
)
`)

createCompaniesTable.run()

const createCompany = db.prepare(`
INSERT INTO companies (name, city) VALUES (@name, @city)
`)

for( let company of companies) createCompany.run(company)

const dropEmployeesTable = db.prepare(`
DROP TABLE IF EXISTS employees;
`)
dropEmployeesTable.run()

const createEmployeesTable = db.prepare(`
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  position TEXT NOT NULL,
  companyId INTEGER,
  PRIMARY KEY (id)
)
`)

createEmployeesTable.run()

const createEmployee = db.prepare(`
INSERT INTO employees (name, email, position, companyId) VALUES (@name, @email, @position, @companyId)
`)

for( let employee of employees) createEmployee.run(employee)