// src/Assessment.js
import { useState } from "react";
import { createAssessment } from "./api";      // ✅ only this import
import { useAuth } from "./auth/AuthContext.jsx";

const initial = { name: "", interest: "", confidence: "" };

export default function Assessment() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth(); // user?.email used in payload

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.interest.trim()) e.interest = "Interest is required";
    if (!form.confidence.trim()) {
      e.confidence = "Confidence level is required";
    } else {
      const c = Number(form.confidence);
      if (isNaN(c) || c < 1 || c > 5) {
        e.confidence = "Confidence must be between 1 and 5";
      }
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 [Assessment] handleSubmit called with form:", form);

    const v = validate();
    if (Object.keys(v).length) {
      console.log("⚠️ [Assessment] validation errors:", v);
      setErrors(v);
      return;
    }

    try {
      setSubmitError("");
      setSuccess("");
      setLoading(true);

      // ✅ This is what gets sent to MongoDB via backend
      const payload = {
        answers: {
          name: form.name,
          interest: form.interest,
          confidence: form.confidence,
        },
        scores: {
          confidence: Number(form.confidence),
        },
        notes: "",
        userEmail: user ? user.email : null,
      };

      console.log("📡 [Assessment] sending payload to backend:", payload);

      await createAssessment(payload); // 🔗 calls POST /api/assessments

      setSuccess("Assessment saved successfully to backend ✅");
      console.log("✅ [Assessment] save success");
      setForm(initial);
    } catch (err) {
      console.error("❌ [Assessment] error in createAssessment:", err);
      setSubmitError("Unable to save assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Assessment</h2>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </label>

        <label>
          Primary interest
          <input
            name="interest"
            value={form.interest}
            onChange={handleChange}
          />
          {errors.interest && (
            <span className="error">{errors.interest}</span>
          )}
        </label>

        <label>
          Confidence level (1–5)
          <input
            name="confidence"
            type="number"
            min="1"
            max="5"
            value={form.confidence}
            onChange={handleChange}
          />
          {errors.confidence && (
            <span className="error">{errors.confidence}</span>
          )}
        </label>

        {submitError && <div className="error">{submitError}</div>}
        {success && <div className="success">{success}</div>}

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
