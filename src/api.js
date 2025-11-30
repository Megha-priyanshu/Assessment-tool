// src/api.js

const API_BASE = "http://localhost:5000";

// ---------- AUTH ----------

export async function registerUser(data) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json();
  if (!res.ok) throw new Error(body.error || "Registration failed");
  return body;
}

export async function loginUser(data) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json();
  if (!res.ok) throw new Error(body.error || "Login failed");
  return body;
}

// ---------- ASSESSMENTS CRUD ----------

export async function createAssessment(data) {
  console.log("📡 [API] POST /api/assessments payload:", data);

  const res = await fetch(`${API_BASE}/api/assessments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("❌ [API] createAssessment error response:", body);
    throw new Error(body.error || "Failed to create assessment");
  }

  console.log("✅ [API] createAssessment success:", body);
  return body;
}

export async function getAssessments(userEmail) {
  const url = userEmail
    ? `${API_BASE}/api/assessments?userEmail=${encodeURIComponent(
        userEmail
      )}`
    : `${API_BASE}/api/assessments`;

  console.log("📡 [API] GET", url);

  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("❌ [API] getAssessments error:", body);
    throw new Error("Failed to load assessments");
  }

  console.log("✅ [API] getAssessments success, count:", body.length);
  return body;
}

export async function updateAssessment(id, data) {
  console.log("📡 [API] PUT /api/assessments/" + id, "payload:", data);

  const res = await fetch(`${API_BASE}/api/assessments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("❌ [API] updateAssessment error:", body);
    throw new Error(body.error || "Failed to update assessment");
  }

  console.log("✅ [API] updateAssessment success:", body);
  return body;
}

export async function deleteAssessment(id) {
  console.log("📡 [API] DELETE /api/assessments/" + id);

  const res = await fetch(`${API_BASE}/api/assessments/${id}`, {
    method: "DELETE",
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("❌ [API] deleteAssessment error:", body);
    throw new Error(body.error || "Failed to delete assessment");
  }

  console.log("✅ [API] deleteAssessment success:", body);
  return body;
}
