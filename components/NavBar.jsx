import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { AuthContext } from './AuthProvider';
import { auth } from '../firebaseConfig';
import { signOut, deleteUser } from 'firebase/auth';
import { toast } from 'react-toastify';
import profileLogo from '../assets/profle.jpg';
import PasswordOverlay from './PasswordOverlay';
import DeleteAccountOverlay from './DeleteAccountOverlay'; // Importing DeleteAccountOverlay
import './NavBar.css';

const NavBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPasswordOverlay, setShowPasswordOverlay] = useState(false);
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false); // Toggle delete overlay
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = () => {
    fetch(`http://localhost:5000/search?skill=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        onSearch(data);
        console.log(data);
        navigate('/search');
      });
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully signed out!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(auth.currentUser);
      toast.success('Account deleted successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete account. Please re-login and try again.');
    }
  };

  const handleEditPassword = () => {
    setShowPasswordOverlay(true);
  };

  const confirmDelete = () => {
    handleDeleteAccount();
    setShowDeleteOverlay(false);
  };

  return (
    <Navbar className="nav">
      <Navbar.Brand href="/" className="LOGO">Resume Parser</Navbar.Brand>

      <div className="right">
        <input
          className="bar"
          type="text"
          placeholder="Search by skill..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="barButton" onClick={handleSearch}>Search</button>
      </div>

      <div className="profile" onClick={toggleDropdown}>
        <img src={profileLogo} alt="Profile" className="profileLogo" />
        {showDropdown && (
          <div className="profile-dropdown">
            {currentUser ? (
              <>
                <p><img src={profileLogo} alt="Profile" className='profile-dropLogo'/> {currentUser.email}</p>
                <button onClick={handleSignOut} className='Logout'>Logout</button>
                <button onClick={() => setShowDeleteOverlay(true)} className='twoThreebutton'>Delete My Account</button>
                <button onClick={handleEditPassword} className='twoThreebutton'>Edit Password</button>
              </>
            ) : (
              <p>Please log in</p>
            )}
          </div>
        )}
      </div>

      {showPasswordOverlay && <PasswordOverlay onClose={() => setShowPasswordOverlay(false)} />}
      {showDeleteOverlay && <DeleteAccountOverlay onConfirm={confirmDelete} onClose={() => setShowDeleteOverlay(false)} />}
    </Navbar>
  );
};

export default NavBar;
