const API_BASE = "http://localhost:5000";

// ========== AUTH ==========

export async function registerUser(data) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || "Registration failed");
  }
  return body;
}

export async function loginUser(data) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || "Login failed");
  }
  return body;
}

// ========== FULL ASSESSMENT CRUD ==========

// CREATE – save full assessment
export async function saveFullAssessment(data) {
  const res = await fetch(`${API_BASE}/api/full-assessment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// READ LATEST – get last saved assessment
export async function getLatestFullAssessment() {
  const res = await fetch(`${API_BASE}/api/full-assessment/latest`);
  return res.json();
}

// READ ALL – list all assessments (optionally for one user)
export async function getAllFullAssessments(userEmail) {
  const url = userEmail
    ? `${API_BASE}/api/full-assessment?userEmail=${encodeURIComponent(
        userEmail
      )}`
    : `${API_BASE}/api/full-assessment`;

  const res = await fetch(url);
  return res.json();
}

// UPDATE – update assessment (e.g., notes)
export async function updateFullAssessment(id, data) {
  const res = await fetch(`${API_BASE}/api/full-assessment/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// DELETE – delete assessment
export async function deleteFullAssessment(id) {
  const res = await fetch(`${API_BASE}/api/full-assessment/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
