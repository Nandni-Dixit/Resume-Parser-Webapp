import React, { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Firebase auth import
import { toast } from 'react-toastify';
import './PasswordOverlay.css'; // Importing the styling for overlay

const PasswordOverlay = ({ onClose }) => {
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = async () => {
    if (!newPassword) {
      toast.error('Please enter a new password.');
      return;
    }
    try {
      await updatePassword(auth.currentUser, newPassword);
      toast.success('Password updated successfully!');
      onClose(); // Close the overlay after success
    } catch (error) {
      toast.error('Failed to update password. Please re-login and try again.');
      console.error('Password update error:', error);
    }
  };

  return (
    <div className="password-overlay">
      <div className="password-overlay-content">
        <h2>Edit Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <div className="password-overlay-buttons">
          <button onClick={handlePasswordChange} className='updatePassword'>Update Password</button>
          <button onClick={onClose} className='cancel'>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PasswordOverlay;
