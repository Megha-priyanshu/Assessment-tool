import React from 'react';

const Result = ({ results }) => {
    return (
        <div className="result-container">
            <h2>Assessment Results</h2>
            {results && results.length > 0 ? (
                <div className="career-matches">
                    {results.map((result, index) => (
                        <div className="career-match-card" key={index}>
                            <div className="career-match-header">
                                {result.icon && (
                                    <img src={result.icon} alt={result.title} className="career-icon" />
                                )}
                                <span className="career-title">{result.title}</span>
                                {result.match && (
                                    <span className="match-badge">{result.match}% match</span>
                                )}
                            </div>
                            <div className="career-desc">{result.description}</div>
                            {result.salary && (
                                <div className="career-meta">
                                    <span>{result.salary}</span>
                                    {result.growth && <span>• {result.growth}</span>}
                                    {result.mode && <span>• {result.mode}</span>}
                                </div>
                            )}
                            {result.skills && (
                                <div className="career-tags">
                                    {result.skills.map((skill, i) => (
                                        <span key={i}>{skill}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No results available. Please complete the assessment.</p>
            )}
        </div>
    );
};

export default Result;