// src/components/SignUp.jsx
import React, { useState } from 'react';
import { auth } from '../firebaseConfig'; // Ensure this path is correct
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AuthStyles.css';
const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // For navigation

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!'); // Notify user
      navigate('/SignIn'); // Redirect to Sign In page
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.message); // Show error message
    }
  };

  return (
    <div className="page">
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="submit-button">Sign Up</button>
      </form>
      <p>
        Already a user? <a href="/SignIn">Sign In</a>
      </p>
    </div>
    </div>
  );
};

export default SignUp;
