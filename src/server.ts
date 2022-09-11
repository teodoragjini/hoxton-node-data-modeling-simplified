import Database from "better-sqlite3";
import cors from "cors";
import express from "express";

const db = Database("./db/data.db", { verbose: console.log });
const app = express();
app.use(cors());
app.use(express.json());

const port = 5678;

const getAplicantById = db.prepare(`SELECT * FROM aplicants WHERE id = @id;`);

const getInterviewerById = db.prepare(
  `SELECT * FROM interviewers WHERE id = @id;`
);

const getInterviewsForAplicant = db.prepare(`
SELECT interviews.* FROM interviews
JOIN aplicants ON aplicants.id = interviews.aplicantId
WHERE interviews.aplicantId = @aplicantId;
`);

const getInterviewsForInterviewer = db.prepare(`
SELECT interviews.* FROM interviews
JOIN interviewers ON interviewers.id = interviews.interviewerId
WHERE interviews.interviewerId = @interviewerId;
`);

const getCompaniesFromId = db.prepare(`
SELECT * FROM companies WHERE id = @id;
`);
const getCompanies = db.prepare(`
SELECT * FROM companies;
`);

app.get("/aplicants/:id", (req, res) => {
  const aplicant = getAplicantById.get(req.params);

  if (aplicant) {
    aplicant.interviews = getInterviewsForAplicant.all({
      aplicantId: aplicant.id,
    });
    res.send(aplicant);
  } else {
    res.status(404).send({ error: "Aplicant not found" });
  }
});

const createAplicant = db.prepare(`
INSERT INTO aplicants (name, email) VALUES (@name, @email);
`);

app.post("/aplicants", (req, res) => {
  const name = req.body.name
  const email = req.body.email

  res.send(createAplicant.run({name, email}));
});

app.get("/interviewers/:id", (req, res) => {
  const interviewer = getInterviewerById.get(req.params);

  if (interviewer) {
    interviewer.interviews = getInterviewsForInterviewer.all({
      interviewerId: interviewer.id,
    });
    res.send(interviewer);
  } else {
    res.status(404).send({ error: "Interviewer not found" });
  }
});

const createInterviewer = db.prepare(`
INSERT INTO interviewers (name, email, companyId) VALUES (@name, @email, @companyId);
`);

app.post("/interviewers", (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const companyId = req.body.companyId

  res.send(createInterviewer.run({name, email, companyId}));
});

const createInterviews = db.prepare(`
INSERT INTO interviews (aplicantId, interviewerId, date, score) VALUES (@aplicantId, @interviewerId, @date, @score);
`);

app.post("/interviews", (req, res) => {
  const aplicantId = req.body.aplicantId
  const interviewerId = req.body.interviewerId
  const date = req.body.date
  const score = req.body.score

  res.send(createInterviews.run({aplicantId, interviewerId, date, score}));
 
});

const createCompany = db.prepare(`
INSERT INTO companies (name, city) VALUES (@name, @city)
`);

app.post('/companies', (req,res) => {
  const name = req.body.name;
  const city = req.body.city;

  res.send(createCompany.run({name, city}))
})

const fire = db.prepare(`
DELETE FROM employees WHERE employees.id = @id
`);
const getEmployeeById = db.prepare(`
SELECT * FROM employees WHERE id = @id;
`);
app.delete('/companies/fire/:id', (req,res) => {
  const employee = getEmployeeById.get(req.params);

  if (employee) {
    res.send(fire.run({id: employee.id}));
  } else {
    res.status(404).send({ error: "Employee not found" });
  }
})

const updateInterview = db.prepare(`
UPDATE interviews SET successful = @value WHERE interviews.id = @id
`)
const getInterviewById = db.prepare(`
SELECT * FROM interviews WHERE id = @id;
`);
app.patch('/interviews/:id', (req, res) => {
  const interview = getInterviewById.get(req.params);

  if (interview) {
    res.send(updateInterview.run({value: req.body.value, id: interview.id}));
  } else {
    res.status(404).send({ error: "Interview not found" });
  }
})

app.listen(port, () => {
  console.log(`App running on: http://localhost:${port}`);
});
