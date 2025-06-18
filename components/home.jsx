import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/upload');
  };

  return (
    <div className="home-container">
      <div className="home-left">
        <div className="wrapper">
          <div className="static-txt">Welcome to</div>
          <ul className="dynamic-txts">
            <li><span>"ResumeParser"</span></li>
          </ul>
        </div>
        <p>
          Easily upload, parse, and search resumes. Start by uploading your resume files, and search for the ideal candidates based on their skills and qualifications.</p> 
          <p>It's fast, simple, and efficient.</p>
        <button onClick={handleGetStarted}>Get Started</button>
      </div>
      <div className="home-right">
        <img src="../src/assets/right1.png" alt="Project Illustration" />
      </div>
    </div>
  );
};

export default HomePage;
