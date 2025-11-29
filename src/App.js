import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import {
  saveFullAssessment,
  getAllFullAssessments,
  deleteFullAssessment,
  updateFullAssessment,
  loginUser,
  registerUser,
} from "./api";

// ---- careerSuggestions ----
const careerSuggestions = [
  {
    match: (s, a, l) => s === "math" && a === "problem",
    title: "Engineer / Data Scientist",
    desc: "You enjoy solving problems and working with numbers.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=facearea&w=256&q=80",
  },
  {
    match: (s, a, l) => s === "science" && l === "hands",
    title: "Medical / Research Scientist",
    desc: "You like hands-on science.",
    img: "https://images.unsplash.com/photo-1559757175-5700dde67548?auto=format&fit=facearea&w=256&q=80",
  },
  {
    match: (s, a, l) => s === "arts" && a === "creative",
    title: "Designer / Writer / Artist",
    desc: "Your creativity shines!",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=256&q=80",
  },
  {
    match: (s, a, l) => s === "sports" && a === "outdoor",
    title: "Athlete / Fitness Trainer",
    desc: "You love being active.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&q=80",
  },
  {
    match: (s, a, l) => a === "team",
    title: "Manager / Team Leader",
    desc: "You enjoy teamwork.",
    img: "https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?auto=format&fit=facearea&w=256&q=80",
  },
  {
    match: (s, a, l) => s === "science" && a === "problem",
    title: "Technologist / Analyst",
    desc: "You like science and problem-solving.",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=256&q=80",
  },
  {
    match: (s, a, l) => s === "arts" && l === "visual",
    title: "Graphic Designer / Animator",
    desc: "You love visual learning.",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=256&q=80",
  },
  {
    match: (s, a, l) => s === "math" && l === "reading",
    title: "Accountant / Economist",
    desc: "You enjoy math and reading.",
    img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=facearea&w=256&q=80",
  },
];

// ---------------- Sidebar ----------------
function Sidebar({ currentUser, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <img
          src="https://img.icons8.com/color/96/briefcase.png"
          alt="Logo"
        />
        <span>Career Tool</span>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Assessment</Link>
          </li>
          <li>
            <Link to="/results">Results</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          {!currentUser && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      {currentUser && (
        <div className="user-info">
          <p>
            Logged in as <strong>{currentUser.name}</strong>
          </p>
          <button className="small-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}

function CareerCard({ suggestion }) {
  if (!suggestion) return null;
  return (
    <div className="career-card">
      <img src={suggestion.img} alt={suggestion.title} />
      <div className="career-title">{suggestion.title}</div>
      <div className="career-desc">{suggestion.desc}</div>
    </div>
  );
}

// ---------------- Assessment ----------------
function AssessmentForm({ onResult, currentUser }) {
  const [form, setForm] = useState({
    subject: "",
    activity: "",
    learning: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    let suggestion = careerSuggestions.find((s) =>
      s.match(form.subject, form.activity, form.learning)
    );

    if (!suggestion) {
      suggestion = {
        title: "Explore More!",
        desc: "Try exploring different fields.",
        img: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=facearea&w=256&q=80",
      };
    }

    onResult(suggestion);

    const payload = {
      answers: form,
      scores: form,
      careerSuggestions: [suggestion],
      userEmail: currentUser ? currentUser.email : null,
    };

    try {
      setSaving(true);
      await saveFullAssessment(payload);
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to save assessment. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Which subject do you enjoy the most?</label>
        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="math">Mathematics</option>
          <option value="science">Science</option>
          <option value="arts">Arts</option>
          <option value="sports">Sports</option>
        </select>
      </div>

      <div className="form-group">
        <label>What type of activities do you prefer?</label>
        <select
          name="activity"
          value={form.activity}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="problem">Solving Problems</option>
          <option value="creative">Creative Work</option>
          <option value="team">Teamwork</option>
          <option value="outdoor">Outdoor Activities</option>
        </select>
      </div>

      <div className="form-group">
        <label>What is your favorite way to learn?</label>
        <select
          name="learning"
          value={form.learning}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="visual">Visual</option>
          <option value="hands">Hands-on</option>
          <option value="reading">Reading/Writing</option>
          <option value="listening">Listening</option>
        </select>
      </div>

      {submitError && <p className="error-text">{submitError}</p>}

      <button type="submit" className="submit-btn" disabled={saving}>
        {saving ? "Saving..." : "Get Suggestion & Save"}
      </button>
    </form>
  );
}

function AssessmentPage({ currentUser }) {
  const [suggestion, setSuggestion] = useState(null);

  return (
    <section className="card">
      <AssessmentForm
        onResult={setSuggestion}
        currentUser={currentUser}
      />
      <CareerCard suggestion={suggestion} />
    </section>
  );
}

// ---------------- Results (Protected) ----------------
function ResultsPage({ currentUser }) {
  const [assessments, setAssessments] = useState([]);
  const [editNotes, setEditNotes] = useState({});
  const [loading, setLoading] = useState(true);

  if (!currentUser) {
    return (
      <section className="card">
        <h2>Results</h2>
        <p>Please login to view your saved assessments.</p>
        <Link className="submit-btn" to="/login">
          Go to Login
        </Link>
      </section>
    );
  }

  const loadAll = async () => {
    setLoading(true);
    const data = await getAllFullAssessments(currentUser.email);
    setAssessments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, [currentUser.email]);

  const handleDelete = async (id) => {
    await deleteFullAssessment(id);
    setAssessments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateNotes = async (id) => {
    const updated = await updateFullAssessment(id, {
      notes: editNotes[id] || "",
    });
    setAssessments((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
  };

  if (loading) return <p>Loading...</p>;

  if (assessments.length === 0) {
    return (
      <section className="card">
        <h2>Saved Assessments</h2>
        <p>No saved assessments yet.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Saved Assessments</h2>
      {assessments.map((item) => (
        <div key={item.id} className="result-item">
          <p>
            <strong>Date:</strong>{" "}
            {new Date(item.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Subject:</strong> {item.answers.subject}
          </p>
          <p>
            <strong>Activity:</strong> {item.answers.activity}
          </p>
          <p>
            <strong>Learning:</strong> {item.answers.learning}
          </p>
          <p>
            <strong>Notes:</strong> {item.notes || "None"}
          </p>

          <textarea
            placeholder="Edit notes..."
            value={editNotes[item.id] || ""}
            onChange={(e) =>
              setEditNotes({ ...editNotes, [item.id]: e.target.value })
            }
          />

          <button
            className="small-btn"
            onClick={() => handleUpdateNotes(item.id)}
          >
            Save Notes
          </button>
          <button
            className="small-btn danger"
            onClick={() => handleDelete(item.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </section>
  );
}

// ---------------- About ----------------
function AboutPage() {
  return (
    <section className="card">
      <h2>About</h2>
      <p>
        This tool helps students discover suitable career paths using their
        interests and learning styles. It is built with React (routing,
        forms, validation) and a Node.js / Express backend with basic CRUD
        and authentication.
      </p>
    </section>
  );
}

// ---------------- Auth Pages ----------------
function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    try {
      const user = await loginUser(form);
      onLogin(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password (min 4 chars)</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={4}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>
    </section>
  );
}

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setSuccess("Registration successful! You can login now.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password (min 4 chars)</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={4}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        <button type="submit" className="submit-btn">
          Register
        </button>
      </form>
    </section>
  );
}

// ---------------- App Root ----------------
function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <div className="container">
      <Sidebar currentUser={currentUser} onLogout={handleLogout} />
      <main className="main-content">
        <header className="main-header">
          <h1>Career Assessment</h1>
          <p>Discover your ideal career path.</p>
        </header>

        <Routes>
          <Route
            path="/"
            element={<AssessmentPage currentUser={currentUser} />}
          />
          <Route
            path="/results"
            element={<ResultsPage currentUser={currentUser} />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/login"
            element={<LoginPage onLogin={setCurrentUser} />}
          />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
