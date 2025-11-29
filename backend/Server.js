const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// =============== AUTH (IN-MEMORY) ===============

let users = []; // { id, name, email, password }
let nextUserId = 1;

// Register
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email and password are required" });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const user = {
    id: nextUserId++,
    name,
    email,
    password, // NOTE: plain text for demo only (not for real apps)
  };
  users.push(user);

  // Don't send password back
  const { password: _, ...userSafe } = user;
  res.json(userSafe);
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const { password: _, ...userSafe } = user;
  res.json(userSafe);
});

// =============== FULL ASSESSMENTS (CRUD) ===============

let fullAssessments = []; // { id, createdAt, answers, scores, careerSuggestions, notes, userEmail }
let nextAssessmentId = 1;

// CREATE – save a full assessment
app.post("/api/full-assessment", (req, res) => {
  const { answers, scores, careerSuggestions, notes, userEmail } = req.body;

  if (!answers || !scores) {
    return res
      .status(400)
      .json({ error: "answers and scores are required" });
  }

  const entry = {
    id: nextAssessmentId++,
    createdAt: new Date().toISOString(),
    answers,
    scores,
    careerSuggestions: careerSuggestions || [],
    notes: notes || "",
    userEmail: userEmail || null,
  };

  fullAssessments.push(entry);
  console.log("Created assessment:", entry.id);
  res.json(entry);
});

// READ ALL – list all or only for specific user
app.get("/api/full-assessment", (req, res) => {
  const { userEmail } = req.query;
  let list = fullAssessments;

  if (userEmail) {
    list = list.filter((a) => a.userEmail === userEmail);
  }

  res.json(list);
});

// READ LATEST – last saved assessment
app.get("/api/full-assessment/latest", (req, res) => {
  if (fullAssessments.length === 0) {
    return res.status(404).json({ error: "No assessments found" });
  }
  const latest = fullAssessments[fullAssessments.length - 1];
  res.json(latest);
});

// UPDATE – update an assessment (e.g., notes)
app.put("/api/full-assessment/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = fullAssessments.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Assessment not found" });
  }

  fullAssessments[index] = {
    ...fullAssessments[index],
    ...req.body,
  };

  console.log("Updated assessment:", id);
  res.json(fullAssessments[index]);
});

// DELETE – remove an assessment
app.delete("/api/full-assessment/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = fullAssessments.length;
  fullAssessments = fullAssessments.filter((item) => item.id !== id);

  if (fullAssessments.length === before) {
    return res.status(404).json({ error: "Assessment not found" });
  }

  console.log("Deleted assessment:", id);
  res.json({ message: "Deleted", id });
});

// =============== ROOT ===============
app.get("/", (req, res) => {
  res.send("Career Assessment backend is running 🚀");
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
