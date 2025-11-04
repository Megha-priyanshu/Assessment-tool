import React, { useState } from 'react';

const AssessmentForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        activity: '',
        learning: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="assessment-form">
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="subject">Which software field interests you the most?</label>
                <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select</option>
                    <option value="webdev">Web Development</option>
                    <option value="datasci">Data Science</option>
                    <option value="uiux">UI/UX Design</option>
                    <option value="sysadmin">Systems/Cloud</option>
                </select>
            </div>
            <div>
                <label htmlFor="activity">What type of activities do you prefer?</label>
                <select
                    id="activity"
                    name="activity"
                    value={formData.activity}
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
            <div>
                <label htmlFor="learning">What is your favorite way to learn?</label>
                <select
                    id="learning"
                    name="learning"
                    value={formData.learning}
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
            <button type="submit">Submit</button>
        </form>
    );
};

export default AssessmentForm;
