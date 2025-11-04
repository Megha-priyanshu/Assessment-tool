import React from 'react';
import './Header.css'; // Assuming you have a separate CSS file for header styles

const Header = () => {
    return (
        <header className="header">
            <h1>Career Assessment Tool</h1>
            <nav>
                <ul>
                    <li><a href="#assessment">Assessment</a></li>
                    <li><a href="#results">Results</a></li>
                    <li><a href="#about">About</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;