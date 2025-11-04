import React, { useState } from "react";
import "./App.css";

const careerSuggestions = [
	{
		match: (s, a, l) => s === "math" && a === "problem",
		title: "Engineer / Data Scientist",
		desc: "You enjoy solving problems and working with numbers. Careers in engineering, data science, or finance may suit you well.",
		img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=facearea&w=256&q=80",
	},
	{
		match: (s, a, l) => s === "science" && l === "hands",
		title: "Medical / Research Scientist",
		desc: "You like hands-on science. Consider medicine, laboratory research, or environmental science.",
		img: "https://images.unsplash.com/photo-1559757175-5700dde67548?auto=format&fit=facearea&w=256&q=80",
	},
	{
		match: (s, a, l) => s === "arts" && a === "creative",
		title: "Designer / Writer / Artist",
		desc: "Your creativity shines! Explore careers in design, writing, or the performing arts.",
		img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=256&q=80",
	},
	{
		match: (s, a, l) => s === "sports" && a === "outdoor",
		title: "Athlete / Fitness Trainer",
		desc: "You love being active and outdoors. Consider sports, fitness training, or physical education.",
		img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&q=80",
	},
	{
		match: (s, a, l) => a === "team",
		title: "Manager / Team Leader",
		desc: "You enjoy teamwork and leadership. Careers in management, project coordination, or human resources may be a good fit.",
		img: "https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?auto=format&fit=facearea&w=256&q=80",
	},
	{
		match: (s, a, l) => s === "science" && a === "problem",
		title: "Technologist / Analyst",
		desc: "You like science and problem-solving. Consider technology, analytics, or research roles.",
		img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=256&q=80",
	},
	{
		match: (s, a, l) => s === "arts" && l === "visual",
		title: "Graphic Designer / Animator",
		desc: "You have a visual learning style and love the arts. Graphic design, animation, or photography could be great for you.",
		img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=256&q=80",
	},
	{
		match: (s, a, l) => s === "math" && l === "reading",
		title: "Accountant / Economist",
		desc: "You enjoy math and learning through reading. Consider accounting, economics, or teaching.",
		img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=facearea&w=256&q=80",
	},
];

function Sidebar() {
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
					<li className="active">
						<span>Assessment</span>
					</li>
					<li>
						<span>Results</span>
					</li>
					<li>
						<span>About</span>
					</li>
				</ul>
			</nav>
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

function AssessmentForm({ onResult }) {
	const [form, setForm] = useState({
		subject: "",
		activity: "",
		learning: "",
	});

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		let suggestion = careerSuggestions.find((s) =>
			s.match(form.subject, form.activity, form.learning)
		);
		if (!suggestion) {
			suggestion = {
				title: "Explore More!",
				desc: "Try exploring different fields and talk to mentors to discover what excites you most.",
				img: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=facearea&w=256&q=80",
			};
		}
		onResult(suggestion);
	};

	return (
		<form id="assessmentForm" onSubmit={handleSubmit}>
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
			<button type="submit" className="submit-btn">
				Get Suggestion
			</button>
		</form>
	);
}

function App() {
	const [suggestion, setSuggestion] = useState(null);

	return (
		<div className="container">
			<Sidebar />
			<main className="main-content">
				<header className="main-header">
					<h1>Career Assessment</h1>
					<p>
						Answer a few questions to discover your ideal career path.
					</p>
				</header>
				<section className="card">
					<AssessmentForm onResult={setSuggestion} />
					<div id="result">
						<CareerCard suggestion={suggestion} />
					</div>
				</section>
			</main>
		</div>
	);
}

export default App;