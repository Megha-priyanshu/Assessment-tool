// src/App.jsx
import { Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext.jsx";
import "./App.css";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Career Assessment Tool</h1>
        <nav className="nav">
          <Link to="/assessment">Assessment</Link>
          <Link to="/results">Saved Results</Link>
          {user ? (
            <button onClick={logout} className="link-button">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main className="app-main">
        <section className="card-grid">
          <div className="card">
            <h2>Full Assessment</h2>
            <p>Answer a complete set of questions and get a detailed profile.</p>
            <Link className="primary-btn" to="/assessment">
              Start now
            </Link>
          </div>
          <div className="card">
            <h2>Saved Results</h2>
            <p>Review, update or delete your previous assessments.</p>
            <Link className="secondary-btn" to="/results">
              View results
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
// src/api.js