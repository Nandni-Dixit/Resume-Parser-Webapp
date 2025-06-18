
import React from 'react';
import './DeleteAccountOverlay.css'; 

const DeleteAccountOverlay = ({ onConfirm, onClose }) => {
  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>Delete Account</h2>
        <p>Are you sure you want to delete your account? This action is irreversible.</p>
        <div className="overlay-buttons">
          <button className="confirm-button" onClick={onConfirm}>Confirm</button>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountOverlay;
