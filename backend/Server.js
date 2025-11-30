// server.js
require("dotenv").config(); // only works if you have a .env file (optional)



const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ---------- CONFIG ----------
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/career-tool";

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// ---------- MONGODB CONNECTION ----------
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected:", MONGO_URI);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

connectDB();

// ---------- MONGOOSE SCHEMA & MODEL ----------
// You can edit fields as per your assessment structure
const assessmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: false }, // student name (optional)
    email: { type: String, required: false }, // email (optional)
    answers: { type: Array, default: [] }, // all answers from frontend
    score: { type: Number, default: 0 }, // total score
    suggestedCareers: { type: [String], default: [] }, // list of suggested careers
  },
  { timestamps: true }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);

// ---------- ROUTES ----------

// Health check
app.get("/", (req, res) => {
  res.send("✅ Career backend with MongoDB is running.");
});

// Create/save an assessment
app.post("/api/assessments", async (req, res) => {
  try {
    console.log("🧾 POST /api/assessments hit with body:", req.body);

    const { name, email, answers, score, suggestedCareers } = req.body;

    const assessment = await Assessment.create({
      name,
      email,
      answers,
      score,
      suggestedCareers,
    });

    console.log("💾 Saved assessment with _id:", assessment._id);

    res.status(201).json(assessment);
  } catch (err) {
    console.error("❌ Error in POST /api/assessments:", err);
    res.status(500).json({ message: "Server error while saving assessment" });
  }
});

// Get all assessments (or later you can filter by email, etc.)
app.get("/api/assessments", async (req, res) => {
  try {
    console.log("📄 GET /api/assessments hit");

    const assessments = await Assessment.find().sort({ createdAt: -1 });

    res.json(assessments);
  } catch (err) {
    console.error("❌ Error in GET /api/assessments:", err);
    res.status(500).json({ message: "Server error while fetching assessments" });
  }
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = app;
