const express = require("express");
const cors = require("cors");

console.log("🔥 USING CAREER TOOL BACKEND server.js 🔥");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ================= IN-MEMORY DATABASE =================

let users = [];          // { id, name, email, password }
let assessments = [];    // { id, userEmail, createdAt, answers, scores, notes }
let nextUserId = 1;
let nextAssessmentId = 1;

// ================= AUTH ROUTES =================

// REGISTER
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const user = {
    id: nextUserId++,
    name,
    email,
    password // plain text for demo
  };

  users.push(user);

  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

// LOGIN
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

// ================= ASSESSMENT ROUTES =================

// CREATE ASSESSMENT
app.post("/api/assessments", (req, res) => {
  const { answers, scores, notes, userEmail } = req.body;

  if (!answers || !scores) {
    return res.status(400).json({ error: "answers and scores are required" });
  }

  const item = {
    id: nextAssessmentId++,
    userEmail: userEmail || null,
    createdAt: new Date().toISOString(),
    answers,
    scores,
    notes: notes || ""
  };

  assessments.push(item);
  res.json(item);
});

// READ ALL ASSESSMENTS
app.get("/api/assessments", (req, res) => {
  const { userEmail } = req.query;
  let list = assessments;

  if (userEmail) {
    list = list.filter((a) => a.userEmail === userEmail);
  }

  res.json(list);
});

// UPDATE ASSESSMENT (e.g. notes)
app.put("/api/assessments/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = assessments.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Assessment not found" });
  }

  assessments[index] = {
    ...assessments[index],
    ...req.body
  };

  res.json(assessments[index]);
});

// DELETE ASSESSMENT
app.delete("/api/assessments/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = assessments.length;

  assessments = assessments.filter((a) => a.id !== id);

  if (assessments.length === before) {
    return res.status(404).json({ error: "Assessment not found" });
  }

  res.json({ message: "Deleted", id });
});

// ================= ROOT TEST ROUTE =================

app.get("/", (req, res) => {
  res.send("Career Assessment backend is running 🚀");
});

// ================= START SERVER =================

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
