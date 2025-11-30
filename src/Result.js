// src/Result.js
import { useEffect, useState } from "react";
import { useAuth } from "./auth/AuthContext.jsx";
import {
  getAssessments,
  updateAssessment,
  deleteAssessment,
} from "./api.js";

export default function Result() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [editNotes, setEditNotes] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // ---------- LOAD RESULTS FOR LOGGED-IN USER ----------
  useEffect(() => {
    const load = async () => {
      if (!user?.email) {
        setLoading(false);
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError("");
        // our api.js getAssessments returns plain JSON array
        const data = await getAssessments(user.email);
        setResults(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load results");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  // ---------- UPDATE NOTES TEXTAREA STATE ----------
  const handleNotesChange = (id, value) => {
    setEditNotes((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ---------- SAVE NOTES (UPDATE) ----------
  const handleUpdate = async (id) => {
    try {
      const updated = await updateAssessment(id, {
        notes: editNotes[id] || "",
      });

      setResults((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update result");
    }
  };

  // ---------- DELETE RESULT ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;

    try {
      await deleteAssessment(id);
      setResults((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete result");
    }
  };

  // ---------- RENDER ----------
  if (!user) {
    return (
      <div className="page">
        <h2>Saved Results</h2>
        <p>You must be logged in to view your results.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page">
        <h2>Saved Results</h2>
        <p>Loading your results...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Saved Results</h2>
      {error && <div className="error">{error}</div>}

      {results.length === 0 ? (
        <p>No saved results yet. Complete an assessment first.</p>
      ) : (
        <ul className="result-list">
          {results.map((r) => (
            <li key={r.id} className="result-item">
              <div>
                <strong>Date:</strong>{" "}
                {new Date(r.createdAt).toLocaleString()}
                <br />
                <strong>Subject:</strong> {r.answers?.subject}
                <br />
                <strong>Activity:</strong> {r.answers?.activity}
                <br />
                <strong>Learning:</strong> {r.answers?.learning}
                <br />
                <strong>Notes:</strong> {r.notes || "None"}
              </div>

              <div style={{ marginTop: "8px" }}>
                <textarea
                  placeholder="Edit notes..."
                  value={editNotes[r.id] ?? ""}
                  onChange={(e) =>
                    handleNotesChange(r.id, e.target.value)
                  }
                />
                <div>
                  <button onClick={() => handleUpdate(r.id)}>
                    Save Notes
                  </button>
                  <button onClick={() => handleDelete(r.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
